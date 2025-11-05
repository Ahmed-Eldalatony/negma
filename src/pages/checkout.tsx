import { useState, useEffect, useCallback } from 'react';
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
import { GccPhoneInput } from '@/components/ui/phone-number-input';
import { useCartStore, useStoreCountryStore } from '@/store';
import { useStore } from '@/hooks/useStoreData';
import { useProducts } from '@/hooks/useProducts';
import { useCurrency } from '@/hooks/useCurrency';
import { convertPrice, formatPrice } from '@/lib/utils';

type City = {
	id: number;
	name: string;
	name_en: string;
};

// Define the validation schema with Zod
const checkoutSchema = z.object({
	fullName: z.string().min(3, { message: 'الاسم الكامل مطلوب' }),
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
	const { cart, clearCart } = useCartStore();
	const { storeCountryId } = useStoreCountryStore();
	const { data: products } = useProducts();
	const { currency } = useCurrency();
	// Ensure store data is loaded
	useStore();

	useEffect(() => {
		if (storeCountryId) {
			const fetchCities = async () => {
				try {
					const response = await api.get(`v1/utilities/countries/${storeCountryId}/cities`);
					setCities(response.data.data || []);
				} catch (error) {
					console.error('Failed to fetch cities:', error);
					toast({ title: 'خطأ', description: 'فشل في تحميل المدن' });
				}
			};
			fetchCities();
		} else {
			setCities([]);
		}
	}, [storeCountryId, toast]);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm({
		resolver: zodResolver(checkoutSchema),
		defaultValues: {
			fullName: '',
			city: '',
			primaryPhone: '',
			additionalPhone: '',
			detailedAddress: '',
			orderNotes: '',
		},
	});

	const handlePrimaryPhoneChange = useCallback(
		(value: string) => setValue('primaryPhone', value),
		[setValue]
	);
	const handleAdditionalPhoneChange = useCallback(
		(value: string) => setValue('additionalPhone', value),
		[setValue]
	);

	const cartItems = cart
		.map((item) => {
			const product = products?.find((p) => p.id.toString() === item.id);
			if (!product) return null;
			const usdPrice = parseFloat(product.prices[0]?.price_in_usd || '0');
			const convertedPrice = currency ? convertPrice(usdPrice, currency.rate_to_usd) : usdPrice;
			return {
				id: item.id,
				quantity: item.quantity,
				name: product.name,
				price: usdPrice,
				convertedPrice,
			};
		})
		.filter((item) => item !== null);

	const total = cartItems.reduce((sum, item) => sum + item.convertedPrice * item.quantity, 0);

	const onSubmit = () => {
		if (cities.length === 0) {
			toast({ title: 'خطأ', description: 'يرجى الانتظار حتى تحميل المدن' });
			return;
		}
		// Show payment method selection
		setShowPayment(true);
	};

	if (showPayment) {
		return (
			<PaymentMethodPage
				checkoutData={watch()}
				cart={cart}
				onPaymentComplete={(redirectUrl) => {
					if (redirectUrl) {
						window.location.href = redirectUrl;
					} else {
						toast({ title: 'نجح الدفع', description: 'تم إتمام الطلب بنجاح' });
						clearCart();
						reset();
						navigate('/orders');
					}
				}}
			/>
		);
	}

	return (
		<div className="min-h-screen bg-background my-4  w-sm px-4" dir="rtl">
			<div className="max-w-2xl mx-auto">
				<Card>
					<CardHeader className="bg-primary mb-4  rounded-t-lg overflow-hidden text-primary-foreground">
						<CardTitle>إتمام الطلب</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="space-y-4  !text-start">
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

								{/* City */}
								<div className="relative">
									<Label htmlFor="city" className="text-sm font-medium text-foreground mb-1 ">
										المدينة
									</Label>
									<div className="relative">
										<Select
											dir="rtl"
											value={watch('city')}
											onValueChange={(value) => setValue('city', value)}
											disabled={cities.length === 0}
										>
											<SelectTrigger className={errors.city ? 'border-destructive ' : ''}>
												<SelectValue placeholder="اختر المدينة" />
											</SelectTrigger>
											<SelectContent dir="rtl">
												{cities.map((city) => (
													<SelectItem key={city.id} value={city.id.toString()}>
														{city.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									{errors.city && (
										<p className="mt-1 text-sm text-destructive ">{errors.city.message}</p>
									)}
								</div>

								{/* Primary Phone Number */}
								<div className="relative">
									<Label className="text-sm font-medium text-foreground mb-1">
										رقم الهاتف الأساسي
									</Label>
									<GccPhoneInput
										value={watch('primaryPhone')}
										onChange={handlePrimaryPhoneChange}
										countryCode=""
									/>
								</div>

								{/* Additional Phone Number */}
								<div className="relative">
									<Label className="text-sm font-medium text-foreground mb-1 ">
										رقم هاتف إضافي (اختياري)
									</Label>
									<GccPhoneInput
										value={watch('additionalPhone')}
										onChange={handleAdditionalPhoneChange}
										countryCode=""
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
