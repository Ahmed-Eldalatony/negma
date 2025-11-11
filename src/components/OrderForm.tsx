import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
}

const OrderForm = ({ prices, currency }: OrderFormProps) => {
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

	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		address: '',
		quantity: prices && prices.length > 0 ? prices[0].min_quantity.toString() : '1',
		agreed: false,
	});

	return (
		<section id="order-form" className="py-8 px-4 bg-secondary">
			<div className="max-w-lg mx-auto">
				<div className="text-center mb-6">
					<h2 className="text-2xl font-bold mb-2">اطلب الآن 📝</h2>
					<p className="text-sm text-muted-foreground">املأ البيانات وسيصلك المنتج خلال 2-4 أيام</p>
				</div>

				<form className="bg-card rounded-xl p-6 shadow-soft space-y-4">
					{/* Quantity Options */}
					<div className="space-y-3">
						<Label className="text-sm font-semibold">اختر الكمية</Label>

						{prices?.map((pricePackage, index) => {
							const quantity = pricePackage.min_quantity;
							const totalPrice = parseFloat(pricePackage.price_in_usd) * rate;
							const isSelected = formData.quantity === quantity.toString();

							// Calculate savings for packages with quantity > 1
							const unitPrice = prices[0] ? parseFloat(prices[0].price_in_usd) * rate : 0;
							const individualTotal = quantity * unitPrice;
							const savings = quantity > 1 ? individualTotal - totalPrice : 0;

							return (
								<label
									key={pricePackage.id}
									className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border'}`}
								>
									<input
										type="radio"
										name="quantity"
										value={quantity.toString()}
										checked={isSelected}
										onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
										className="sr-only"
									/>
									<div className="flex justify-between items-center">
										<div>
											<p className="font-bold">
												{quantity === 1 ? 'اريد واحدة فقط' : `اشتري ${quantity} قطع`}
											</p>
											<p className="text-xs text-muted-foreground">
												{quantity === 1
													? 'الوحدة الواحدة'
													: index === 1
														? 'الأكثر مبيعاً'
														: 'شحن مجاني'}
											</p>
										</div>
										<div className="text-left">
											<p className="text-xl font-bold">{formatPrice(totalPrice)}</p>
											{quantity > 1 && savings > 0 && (
												<p className="text-xs text-green-600 font-medium line-through">
													توفير {formatPrice(savings)}
												</p>
											)}
										</div>
									</div>
									{quantity > 1 && (
										<div className="mt-2 bg-accent/10 px-3 py-1 rounded text-xs inline-block">
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
							required
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							placeholder="أدخل اسمك"
							className="h-11 text-sm"
						/>
					</div>

					{/* Phone */}
					<div className="space-y-2">
						<Label htmlFor="phone" className="text-sm">
							رقم الهاتف
						</Label>
						<Input
							id="phone"
							type="tel"
							required
							value={formData.phone}
							onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
							placeholder="05xxxxxxxx"
							className="h-11 text-sm"
							dir="ltr"
						/>
					</div>

					{/* Address */}
					<div className="space-y-2">
						<Label htmlFor="address" className="text-sm">
							عنوان التوصيل
						</Label>
						<Textarea
							id="address"
							required
							value={formData.address}
							onChange={(e) => setFormData({ ...formData, address: e.target.value })}
							placeholder="المدينة، الحي، الشارع..."
							className="min-h-20 text-sm"
						/>
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
				</form>
			</div>
		</section>
	);
};

export default OrderForm;
