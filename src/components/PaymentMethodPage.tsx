import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { api } from '@/lib/api';
import { SUBDOMAIN } from '@/store';
import { useProducts } from '@/hooks/useProducts';
import { useCurrency } from '@/hooks/useCurrency';
import { convertPrice, formatPrice } from '@/lib/utils';

type PaymentMethod = {
	name: string;
	code: string;
	logo: string;
};

const PaymentMethodPage = ({
	onPaymentComplete,
	getCheckoutData,
	cart,
}: {
	onPaymentComplete: (redirectUrl?: string) => void;
	getCheckoutData: () => Record<string, unknown>;
	cart: { id: string; quantity: number }[];
}) => {
	const [selectedMethod, setSelectedMethod] = useState<string>('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSuccessDialog, setShowSuccessDialog] = useState(false);
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
	const { data: products } = useProducts();
	const { currency } = useCurrency();

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

	useEffect(() => {
		const fetchPaymentMethods = async () => {
			try {
				const response = await api.get(`v1/store/${SUBDOMAIN()}/payment-methods`);
				setPaymentMethods(response.data);
			} catch (error) {
				console.error('Failed to fetch payment methods:', error);
			}
		};
		fetchPaymentMethods();
	}, []);

	const onSubmit = async () => {
		if (!selectedMethod) {
			alert('يرجى اختيار طريقة الدفع');
			return;
		}

		// Get current checkout data
		const checkoutData = getCheckoutData();

		// Validate required fields
		if (
			!checkoutData.fullName ||
			!checkoutData.email ||
			!checkoutData.city ||
			!checkoutData.detailedAddress
		) {
			alert('يرجى التأكد من ملء جميع الحقول المطلوبة');
			return;
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(checkoutData.email as string)) {
			alert('يرجى إدخال بريد إلكتروني صحيح');
			return;
		}

		// Validate city is a number
		const cityId = parseInt(checkoutData.city as string);
		if (isNaN(cityId)) {
			alert('خطأ في بيانات المدينة');
			return;
		}

		if (cart.length === 0) {
			alert('السلة فارغة');
			return;
		}

		setIsSubmitting(true);
		try {
			const items = cart.map((item) => ({
				sku_id: parseInt(item.id),
				quantity: item.quantity,
			}));
			const customerInfo: Record<string, unknown> = {
				customer_name: checkoutData.fullName as string,
				customer_email: checkoutData.email as string,
				customer_city: cityId,
				customer_address: checkoutData.detailedAddress as string,
			};

			// Only add optional fields if they have values
			if (checkoutData.primaryPhone) {
				customerInfo.customer_phone = checkoutData.primaryPhone as string;
			}
			if (checkoutData.additionalPhone) {
				customerInfo.customer_additional_phone = checkoutData.additionalPhone as string;
			}
			if (checkoutData.orderNotes) {
				customerInfo.customer_notes = checkoutData.orderNotes as string;
			}

			const payload = {
				payment_method: selectedMethod,
				items,
				customer_information: customerInfo,
			};

			console.log('Submitting checkout with payload:', payload);
			console.log('API endpoint:', `v1/store/${SUBDOMAIN()}/checkout`);

			const response = await api.post(`v1/store/${SUBDOMAIN()}/checkout`, payload);
			console.log('Checkout response:', response);

			if (response.data.type === 'redirect') {
				onPaymentComplete(response.data.redirect_url);
			} else {
				setShowSuccessDialog(true);
			}
		} catch (error) {
			console.error('Checkout failed:', error);

			// Try to extract error details from response
			let errorMessage = 'Unknown error';
			if (error && typeof error === 'object' && 'response' in error) {
				const apiError = error as {
					response?: { data?: { message?: string; errors?: Record<string, string[]> } };
				};
				if (apiError.response?.data) {
					console.error('API Error Response:', apiError.response.data);
					if (apiError.response.data.message) {
						errorMessage = apiError.response.data.message;
					} else if (apiError.response.data.errors) {
						// Handle validation errors
						const errors = apiError.response.data.errors;
						const errorMessages = Object.values(errors).flat();
						errorMessage = errorMessages.join(', ');
					}
				}
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}

			alert(`فشل في إتمام الطلب: ${errorMessage}`);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCheckOrder = () => {
		setShowSuccessDialog(false);
		onPaymentComplete();
	};

	return (
		<div className="min-h-screen bg-background w-sm mt-4" dir="rtl">
			<div className="max-w-2xl mx-auto">
				<Card>
					<CardHeader className="bg-primary rounded-t-lg overflow-hidden text-primary-foreground">
						<CardTitle>طريقة الدفع</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Payment Method Selection */}
						<div className="space-y-4">
							<label className="text-sm font-medium text-foreground mb-1 block">
								اختر طريقة الدفع
							</label>
							<div className="grid grid-cols-1 gap-3">
								{paymentMethods.map((method) => (
									<Card
										key={method.code}
										className={`cursor-pointer transition-all hover:shadow-md ${
											selectedMethod === method.code
												? 'ring-2 ring-primary border-primary'
												: 'border-border'
										}`}
										onClick={() => setSelectedMethod(method.code)}
									>
										<CardContent className="p-4">
											<div className="flex items-center space-x-3 space-x-reverse">
												<img
													src={method.logo}
													alt={method.name}
													className="w-12 h-12 object-contain"
												/>
												<div className="flex-1">
													<h3 className="font-medium text-foreground">{method.name}</h3>
												</div>
												{selectedMethod === method.code && (
													<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
														<Check className="h-4 w-4 text-primary-foreground" />
													</div>
												)}
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>

						{/* Order Total */}
						<div className="mt-6 pt-6 border-t border-border">
							<div className="flex justify-between items-center">
								<span className="text-lg font-medium text-foreground">المجموع:</span>
								<span className="text-xl font-bold text-foreground">
									{currency ? formatPrice(total, currency.currency) : `$${total.toFixed(2)}`}
								</span>
							</div>
						</div>

						{/* Submit Button */}
						<div className="mt-6">
							<Button
								onClick={onSubmit}
								disabled={isSubmitting || !selectedMethod}
								className="w-full"
							>
								{isSubmitting ? (
									<>
										<svg
											className="animate-spin -ml-1 mr-3 h-5 w-5"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										جاري معالجة الدفع...
									</>
								) : (
									'متابعة'
								)}
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Success Dialog */}
			<AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<div className="flex flex-col items-center space-y-4">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
								<Check className="h-8 w-8 text-green-600" />
							</div>
							<div className="text-center space-y-4">
								<AlertDialogTitle>تم الدفع بنجاح!</AlertDialogTitle>
								<AlertDialogDescription className="">
									شكراً لك على طلبك. تم تأكيد الدفع بنجاح.
								</AlertDialogDescription>
							</div>
						</div>
					</AlertDialogHeader>
					<AlertDialogFooter className="mx-auto">
						<AlertDialogAction onClick={handleCheckOrder}>عرض الطلب</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default PaymentMethodPage;
