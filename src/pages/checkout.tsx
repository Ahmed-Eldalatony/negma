import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import PaymentMethodPage from '@/components/PaymentMethodPage';

import { useStoreCountryStore } from '@/store';
// import { useStore } from '@/hooks/useStoreData'; // Removed/Commented: See note below
import { useProducts } from '@/hooks/useProducts';
import { useCurrency } from '@/hooks/useCurrency';
import { convertPrice, formatPrice } from '@/lib/utils';
import { pixelTracker } from '@/lib/pixelTracking';

type City = {
	id: number;
	name: string;
	name_en: string;
};

type OrderData = {
	productId: string;
	skuId: string;
	quantity: string;
	customerInfo: {
		name: string;
		phone: string;
		address: string;
	};
};

// Define the validation schema with Zod
const checkoutSchema = z.object({
	fullName: z.string().min(3, { message: 'الاسم الكامل مطلوب' }),
	email: z.string().email({ message: 'البريد الإلكتروني غير صحيح' }),
	city: z.string().min(1, { message: 'المدينة مطلوبة' }),
	primaryPhone: z.string().optional(),
	additionalPhone: z.string().optional(),
	detailedAddress: z.string().min(10, { message: 'العنوان التفصيلي مطلوب' }),
	orderNotes: z.string().optional(),
});

const CheckoutPage = () => {
	const navigate = useNavigate();
	const { toast } = useToast();

	const [showPayment, setShowPayment] = useState(false);
	const [cities, setCities] = useState<City[]>([]);
	const [orderData, setOrderData] = useState<OrderData | null>(null);
	const [hasLoaded, setHasLoaded] = useState(false);
	const { storeCountryId } = useStoreCountryStore();
	const { data: products } = useProducts();
	const { currency } = useCurrency();

	// FIX 1: If useStore() triggers a global state update, calling it here causes an infinite loop.
	// It is usually better to rely on useEffect or ensure this hook doesn't trigger updates on every render.
	// useStore();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
		getValues,
	} = useForm({
		resolver: zodResolver(checkoutSchema),
		defaultValues: {
			fullName: '',
			email: '',
			city: '',
			primaryPhone: '',
			additionalPhone: '',
			detailedAddress: '',
			orderNotes: '',
		},
	});

	// Removed formValues since we're now passing a getter function to PaymentMethodPage

	useEffect(() => {
		if (hasLoaded) return;
		const data = localStorage.getItem('order-data');
		if (data) {
			try {
				const parsed = JSON.parse(data) as OrderData;
				setOrderData(parsed);
				setValue('fullName', parsed.customerInfo.name || '');
				setValue('primaryPhone', parsed.customerInfo.phone || '');
				setValue('detailedAddress', parsed.customerInfo.address || '');
			} catch {
				// Parsing failed
			}
		}
		setHasLoaded(true);
	}, [hasLoaded]); // Remove setValue from dependency to prevent infinite loop

	useEffect(() => {
		if (!orderData) {
			const storedData = localStorage.getItem('order-data');
			if (!storedData) {
				navigate('/');
			}
		}
	}, [orderData, navigate]);

	useEffect(() => {
		if (storeCountryId) {
			const fetchCities = async () => {
				try {
					const response = await api.get(`v1/utilities/countries/${storeCountryId}/cities`);
					// FIX 2: Prevent unnecessary state updates if data is same (React strict mode safety)
					const newCities = response.data.data || [];
					// Only update state if the cities actually changed
					setCities((prevCities) => {
						if (JSON.stringify(prevCities) !== JSON.stringify(newCities)) {
							return newCities;
						}
						return prevCities; // Don't update if same
					});
				} catch (error) {
					console.error('Failed to fetch cities:', error);
					toast({ title: 'خطأ', description: 'فشل في تحميل المدن' });
				}
			};
			fetchCities();
		} else {
			// FIX 3: Check before setting state to avoid loop if storeCountryId toggles or on initial render
			setCities((prev) => (prev.length === 0 ? prev : []));
		}
	}, [storeCountryId, toast]);

	// FIX 4: MEMOIZE CART
	// Creating this array on every render caused PaymentMethodPage to re-render/loop if it depended on 'cart'.
	const cart = useMemo(
		() => (orderData ? [{ id: orderData.productId, quantity: parseInt(orderData.quantity) }] : []),
		[orderData]
	);

	if (!orderData || !products) {
		return (
			<div className="min-h-screen bg-background my-4 w-sm px-4 flex items-center justify-center">
				جاري التحميل...
			</div>
		);
	}

	const product = products.find((p) => p.id.toString() === orderData.productId);
	if (!product) {
		return (
			<div className="min-h-screen bg-background my-4 w-sm px-4 flex items-center justify-center">
				المنتج غير موجود
			</div>
		);
	}

	const quantity = parseInt(orderData.quantity);
	const pricePackage =
		product.prices.find((p) => p.id.toString() === orderData.skuId) || product.prices[0];
	const usdPrice = parseFloat(pricePackage?.price_in_usd || '0');
	const convertedPrice = currency ? convertPrice(usdPrice, currency.rate_to_usd) : usdPrice;
	const total = convertedPrice * quantity;

	const onSubmit = () => {
		if (cities.length === 0) {
			toast({ title: 'خطأ', description: 'يرجى الانتظار حتى تحميل المدن' });
			return;
		}
		setShowPayment(true);
	};

	if (showPayment) {
		return (
			<PaymentMethodPage
				getCheckoutData={() => {
					// Get current form values at submission time using getValues to avoid re-renders
					return getValues();
				}}
				cart={cart}
				onPaymentComplete={(redirectUrl) => {
					if (redirectUrl) {
						window.location.href = redirectUrl;
					} else {
						pixelTracker.trackPurchaseForAll(
							total,
							currency?.currency || 'USD',
							cart.map((item) => item.id)
						);
						toast({ title: 'نجح الدفع', description: 'تم إتمام الطلب بنجاح' });
						localStorage.removeItem('order-data');
						reset();
						navigate('/orders');
					}
				}}
			/>
		);
	}

	return (
		<div className="min-h-screen bg-background my-4 w-sm px-4" dir="rtl">
			<div className="max-w-2xl mx-auto">
				<Card>
					<CardHeader className="bg-primary mb-4 rounded-t-lg overflow-hidden text-primary-foreground">
						<CardTitle>إتمام الطلب</CardTitle>
					</CardHeader>
					<CardContent>
						{/* Order Summary */}
						<div className="mb-6">
							<h3 className="text-lg font-semibold mb-4">ملخص الطلب</h3>
							<div className="space-y-4">
								<div className="flex items-center gap-4 p-4 border rounded-lg">
									<img
										src={product.media[0]?.url || ''}
										alt={product.name}
										className="w-16 h-16 object-cover rounded"
									/>
									<div className="flex-1">
										<h4 className="font-medium">{product.name}</h4>
										<p className="text-sm text-muted-foreground">الكمية: {quantity}</p>
									</div>
									<div className="text-left">
										<p className="font-semibold">
											{currency ? formatPrice(total, currency.currency) : `$${total.toFixed(2)}`}
										</p>
									</div>
								</div>
							</div>
						</div>

						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="space-y-4">
								{/* Full Name */}
								<div className="relative">
									<Label htmlFor="fullName" className="text-sm font-medium text-foreground mb-1">
										الاسم الكامل
									</Label>
									<div className="relative">
										<Input
											type="text"
											id="fullName"
											className={errors.fullName ? 'border-destructive ' : ''}
											placeholder="أدخل اسمك الكامل"
											{...register('fullName')}
										/>
									</div>
									{errors.fullName && (
										<p className="mt-1 text-sm text-destructive">{errors.fullName.message}</p>
									)}
								</div>

								{/* Email */}
								<div className="relative">
									<Label htmlFor="email" className="text-sm font-medium text-foreground mb-1">
										البريد الإلكتروني
									</Label>
									<div className="relative">
										<Input
											type="email"
											id="email"
											className={errors.email ? 'border-destructive ' : ''}
											placeholder="أدخل بريدك الإلكتروني"
											{...register('email')}
										/>
									</div>
									{errors.email && (
										<p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
									)}
								</div>

								{/* City */}
								<div className="relative">
									<Label htmlFor="city" className="text-sm font-medium text-foreground mb-1">
										المدينة
									</Label>
									<div className="relative">
										<Select
											value={watch('city')}
											onValueChange={(value) => setValue('city', value)}
											disabled={cities.length === 0}
										>
											<SelectTrigger className={errors.city ? 'border-destructive ' : ''}>
												<SelectValue placeholder="اختر المدينة" />
											</SelectTrigger>
											<SelectContent>
												{cities.map((city) => (
													<SelectItem key={city.id} value={city.id.toString()}>
														{city.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									{errors.city && (
										<p className="mt-1 text-sm text-destructive">{errors.city.message}</p>
									)}
								</div>

								{/* Primary Phone Number */}
								<div className="relative">
									<Label className="text-sm font-medium text-foreground mb-1">
										رقم الهاتف الأساسي
									</Label>
									<Input
										type="tel"
										value={watch('primaryPhone')}
										onChange={(e) => setValue('primaryPhone', e.target.value)}
									/>
								</div>

								{/* Additional Phone Number */}
								<div className="relative">
									<Label className="text-sm font-medium text-foreground mb-1">
										رقم هاتف إضافي (اختياري)
									</Label>
									<Input
										type="tel"
										value={watch('additionalPhone')}
										onChange={(e) => setValue('additionalPhone', e.target.value)}
									/>
								</div>

								{/* Detailed Address */}
								<div className="relative">
									<Label
										htmlFor="detailedAddress"
										className="text-sm font-medium text-foreground mb-1"
									>
										العنوان التفصيلي
									</Label>
									<div className="relative">
										<Textarea
											id="detailedAddress"
											rows={3}
											className={errors.detailedAddress ? 'border-destructive' : ''}
											placeholder="أدخل عنوانك التفصيلي"
											{...register('detailedAddress')}
										/>
									</div>
									{errors.detailedAddress && (
										<p className="mt-1 text-sm text-destructive">
											{errors.detailedAddress.message}
										</p>
									)}
								</div>

								{/* Order Notes */}
								<div className="relative">
									<Label htmlFor="orderNotes" className="text-sm font-medium text-foreground mb-1">
										ملاحظات الطلب (اختياري)
									</Label>
									<div className="relative">
										<Textarea
											id="orderNotes"
											rows={3}
											placeholder="أي ملاحظات إضافية للطلب"
											{...register('orderNotes')}
										/>
									</div>
								</div>
							</div>

							{/* Order Total */}
							<div className="mt-6 pt-6 border-t border-border">
								<div className="flex justify-between items-center">
									<div className="flex items-center">
										<span className="text-lg font-medium text-foreground">المجموع:</span>
									</div>
									<span className="text-xl font-bold text-foreground">
										{currency ? formatPrice(total, currency.currency) : `$${total.toFixed(2)}`}
									</span>
								</div>
							</div>

							{/* Submit Button */}
							<div className="mt-6">
								<Button type="submit" disabled={cities.length === 0} className="w-full">
									{cities.length === 0 ? 'جاري تحميل المدن...' : 'متابعة لاختيار طريقة الدفع'}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default CheckoutPage;
