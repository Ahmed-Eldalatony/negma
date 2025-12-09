import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { GccPhoneInput } from '@/components/ui/phone-number-input';

interface OrderFormProps {
	prices?: {
		id: string | number;
		min_quantity: number;
		price_in_usd: string;
	}[];
	currency?: {
		currency: string;
		rate_to_usd: string | number;
	};
	productId: string;
}

const orderFormSchema = z.object({
	name: z.string().min(2, { message: 'الاسم مطلوب ويجب أن يكون على الأقل حرفين' }),
	phone: z.string().min(1, { message: 'رقم الهاتف مطلوب' }),
	address: z.string().min(10, { message: 'العنوان مطلوب ويجب أن يكون على الأقل 10 أحرف' }),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

const OrderForm = ({ prices, currency, productId }: OrderFormProps) => {
	const navigate = useNavigate();
	const rate = currency
		? typeof currency.rate_to_usd === 'string'
			? parseFloat(currency.rate_to_usd)
			: currency.rate_to_usd
		: 1;

	const formatPrice = (price: number) => {
		if (currency) {
			return `${price.toFixed(2)} ${currency.currency}`;
		}
		return `$${price.toFixed(2)}`;
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<OrderFormData>({
		resolver: zodResolver(orderFormSchema),
		defaultValues: {
			name: '',
			phone: '',
			address: '',
		},
	});

	const [quantity, setQuantity] = useState(
		prices && prices.length > 0 ? prices[0].min_quantity.toString() : '1'
	);

	const onSubmit = (data: OrderFormData) => {
		const sku = prices?.find((p) => p.min_quantity.toString() === quantity)?.id;
		const orderData = {
			productId,
			skuId: sku,
			quantity,
			customerInfo: {
				name: data.name,
				phone: data.phone,
				address: data.address,
			},
		};
		localStorage.setItem('order-data', JSON.stringify(orderData));
		navigate('/checkout');
	};

	return (
		<section id="order-form" className="py-8 px-4 bg-secondary">
			<div className="max-w-lg mx-auto">
				<div className=" mb-6">
					<h2 className="text-2xl font-bold mb-2">اطلب الآن 📝</h2>
					<p className="text-sm text-muted-foreground">املأ البيانات وسيصلك المنتج خلال 2-4 أيام</p>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="bg-card rounded-xl p-6 shadow-soft space-y-4"
				>
					{/* Quantity Options */}
					<div className="space-y-3">
						<Label className="text-sm font-semibold">اختر الكمية</Label>

						{prices?.map((pricePackage, index) => {
							const selectedQuantity = pricePackage.min_quantity;
							const totalPrice = parseFloat(pricePackage.price_in_usd) * rate;
							const isSelected = quantity === selectedQuantity.toString();

							// Calculate savings for packages with quantity > 1
							const unitPrice = prices[0] ? parseFloat(prices[0].price_in_usd) * rate : 0;
							const individualTotal = selectedQuantity * unitPrice;
							const savings = selectedQuantity > 1 ? individualTotal - totalPrice : 0;

							return (
								<label
									key={pricePackage.id}
									className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border'}`}
								>
									<input
										type="radio"
										name="quantity"
										value={selectedQuantity.toString()}
										checked={isSelected}
										onChange={(e) => setQuantity(e.target.value)}
										className="sr-only"
									/>
									<div className="flex justify-between ">
										<div className="">
											<p className="font-bold">
												{selectedQuantity === 1
													? 'اريد واحدة فقط'
													: `اشتري ${selectedQuantity} قطع`}
											</p>
											<p className="text-xs text-start text-muted-foreground">
												{selectedQuantity === 1
													? 'الوحدة الواحدة'
													: index === 1
														? 'الأكثر مبيعاً'
														: 'شحن مجاني'}
											</p>
										</div>
										<div className="">
											<p className="text-xl font-bold">{formatPrice(totalPrice)}</p>
											{selectedQuantity > 1 && savings > 0 && (
												<p className="text-xs text-green-600 font-medium line-through">
													توفير {formatPrice(savings)}
												</p>
											)}
										</div>
									</div>
									{selectedQuantity > 1 && (
										<div className="mt-2  text-start  bg-gray-100  ml-auto w-fit px-3  rounded text-xs ">
											{index === 1 ? 'العرض الأفضل 🏆' : 'شحن مجاني ✈️'}
										</div>
									)}
								</label>
							);
						})}
					</div>

					<div className="bg-muted rounded-lg p-4 text-sm">
						<p className="font-semibold mb-2">لإجراء طلب، يرجى إدخال معلوماتك هنا:</p>
					</div>

					{/* Name */}
					<div className="space-y-2">
						<Label htmlFor="name" className="text-sm">
							الاسم الأول
						</Label>
						<Input
							id="name"
							type="text"
							{...register('name')}
							placeholder="أدخل اسمك"
							className={`h-11 text-sm ${errors.name ? 'border-destructive' : ''}`}
						/>
						{errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
					</div>

					{/* Phone */}
					<div className="space-y-2">
						<Label className="text-sm">رقم الهاتف</Label>
						<GccPhoneInput onChange={(value) => setValue('phone', value)} countryCode="" />
						{errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
					</div>

					{/* Address */}
					<div className="space-y-2">
						<Label htmlFor="address" className="text-sm">
							عنوان التوصيل
						</Label>
						<Textarea
							id="address"
							{...register('address')}
							placeholder="المدينة، الحي، الشارع..."
							className={`min-h-20 text-sm ${errors.address ? 'border-destructive' : ''}`}
						/>
						{errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
					</div>

					{/* Trust Badges */}
					<div className="grid grid-cols-3 gap-2 pt-2">
						<div className="text-center p-2 bg-secondary rounded">
							<p className="text-xs font-semibold">ضمان 30 يوماً</p>
						</div>
						<div className="text-center p-2 bg-secondary rounded">
							<p className="text-xs font-semibold">شحن مجاني</p>
						</div>
						<div className="text-center p-2 bg-secondary rounded">
							<p className="text-xs font-semibold">الدفع عند الاستلام</p>
						</div>
					</div>

					<p className="text-xs text-center text-muted-foreground pt-2">
						تفتخر حقيبة الظهر المدمجة الكلاسيكية بتصميم أنيق وعملي يجعلها خياراً مثالياً للمدرسة أو
						العمل.
					</p>

					<Button type="submit" className="w-full mt-4">
						تأكيد الطلب
					</Button>
				</form>
			</div>
		</section>
	);
};

export default OrderForm;
