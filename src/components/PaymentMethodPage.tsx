import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
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

type PaymentMethod = {
	name: string;
	code: string;
	logo: string;
};

const PaymentMethodPage = ({
	onPaymentComplete,
	checkoutData,
	cart,
}: {
	onPaymentComplete: (redirectUrl?: string) => void;
	checkoutData: Record<string, unknown>;
	cart: { id: string; quantity: number }[];
}) => {
	const [selectedMethod, setSelectedMethod] = useState<string>('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSuccessDialog, setShowSuccessDialog] = useState(false);
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

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
		if (!selectedMethod) return;

		setIsSubmitting(true);
		try {
			const items = cart.map((item) => ({
				sku_id: parseInt(item.id),
				quantity: item.quantity,
			}));
			const payload = {
				payment_method: selectedMethod,
				items,
				customer_information: {
					customer_name: checkoutData.fullName as string,
					customer_phone: checkoutData.primaryPhone as string,
					customer_additional_phone: (checkoutData.additionalPhone as string) || undefined,
					city_id: parseInt(checkoutData.city as string),
					customer_address: checkoutData.detailedAddress as string,
					customer_notes: (checkoutData.orderNotes as string) || undefined,
				},
			};
			const response = await api.post(`v1/store/${SUBDOMAIN()}/checkout`, payload);
			if (response.data.type === 'redirect') {
				onPaymentComplete(response.data.redirect_url);
			} else {
				setShowSuccessDialog(true);
			}
		} catch (error) {
			console.error('Checkout failed:', error);
			// Handle error - maybe show error message
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
							<div className="relative">
								<label className="text-sm font-medium text-foreground mb-1 block">
									اختر طريقة الدفع
								</label>
								<Select value={selectedMethod} onValueChange={setSelectedMethod}>
									<SelectTrigger>
										<SelectValue placeholder="اختر طريقة الدفع" />
									</SelectTrigger>
									<SelectContent>
										{paymentMethods.map((method) => (
											<SelectItem key={method.code} value={method.code}>
												{method.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Order Total */}
						<div className="mt-6 pt-6 border-t border-border">
							<div className="flex justify-between items-center">
								<span className="text-lg font-medium text-foreground">المجموع:</span>
								<span className="text-xl font-bold text-foreground">$125.50</span>
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
