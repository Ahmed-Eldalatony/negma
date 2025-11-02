import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';

type PaymentMethod = {
	id: number;
	name: string;
	config: {
		inputs: {
			name: string;
			type: string;
			label: string;
			required: boolean;
		}[];
	};
	is_active: boolean;
	created_at: string;
	updated_at: string;
};

// Dynamic schema will be created based on selected method
const PaymentMethodPage = ({ onPaymentComplete }: { onPaymentComplete: () => void }) => {
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
	const [selectedMethod, setSelectedMethod] = useState<string>('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [paymentComplete, setPaymentComplete] = useState(false);

	// Fetch payment methods
	useEffect(() => {
		const fetchPaymentMethods = async () => {
			try {
				const response = await api.get('v1/utilities/payment-methods');
				setPaymentMethods(response.data);
			} catch (error) {
				console.error('Failed to fetch payment methods:', error);
			}
		};
		fetchPaymentMethods();
	}, []);

	// Get selected method config
	const selectedMethodData = paymentMethods.find((m) => m.id.toString() === selectedMethod);

	// Create dynamic schema
	const createSchema = (method: PaymentMethod | undefined) => {
		if (!method) return z.object({});
		const shape: Record<string, z.ZodTypeAny> = {};
		method.config.inputs.forEach((input) => {
			let field = z.string();
			if (input.type === 'email') {
				field = field.email({ message: 'البريد الإلكتروني غير صالح' });
			}
			if (input.required) {
				field = field.min(1, { message: `${input.label} مطلوب` });
			}
			shape[input.name] = field;
		});
		return z.object(shape);
	};

	const schema = createSchema(selectedMethodData);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<any>({
		resolver: zodResolver(schema),
		defaultValues: {},
	});

	const onSubmit = (data: Record<string, unknown>) => {
		setIsSubmitting(true);
		// Simulate API call
		setTimeout(() => {
			console.log('Payment data:', { method: selectedMethod, ...data });
			setIsSubmitting(false);
			setPaymentComplete(true);
			reset();
		}, 2000);
	};

	if (paymentComplete) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-4">
				<Card className="p-8 max-w-md w-full text-center">
					<div className="flex justify-center mb-4">
						<Check className="text-green-500 h-16 w-16" />
					</div>
					<CardTitle className="text-2xl mb-2">تم تأكيد الدفع بنجاح!</CardTitle>
					<p className="text-muted-foreground mb-6">
						شكراً لك على طلبك. سيتم تأكيد التفاصيل عبر البريد الإلكتروني.
					</p>
					<Button onClick={onPaymentComplete} className="w-full">
						العودة للرئيسية
					</Button>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background   w-sm  mt-4 " dir="rtl">
			<div className="max-w-2xl mx-auto">
				<Card>
					<CardHeader className="bg-primary  rounded-t-lg overflow-hidden text-primary-foreground">
						<CardTitle>طريقة الدفع</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							{/* Payment Method Selection */}
							<div className="space-y-4">
								<div className="relative">
									<Label className="text-sm font-medium text-foreground mb-1">
										اختر طريقة الدفع
									</Label>
									<Select value={selectedMethod} onValueChange={setSelectedMethod}>
										<SelectTrigger>
											<SelectValue placeholder="اختر طريقة الدفع" />
										</SelectTrigger>
										<SelectContent>
											{paymentMethods
												.filter((m) => m.is_active)
												.map((method) => (
													<SelectItem key={method.id} value={method.id.toString()}>
														{method.name}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
								</div>

								{/* Dynamic Inputs */}
								{selectedMethodData && (
									<div className="space-y-4  rounded-lg">
										<h3 className="font-medium text-foreground">{selectedMethodData.name}</h3>
										{selectedMethodData.config.inputs.map((input) => (
											<div key={input.name} className="relative">
												<Label
													htmlFor={input.name}
													className="text-sm font-medium text-foreground mb-1"
												>
													{input.label} {input.required && '*'}
												</Label>
												<Input
													type={input.type}
													id={input.name}
													className={errors[input.name] ? 'border-destructive' : ''}
													placeholder={`أدخل ${input.label}`}
													{...register(input.name)}
												/>
												{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
												{(errors as any)[input.name] && (
													<p className="mt-1 text-sm text-destructive">
														{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
														{(errors as any)[input.name]?.message}
													</p>
												)}
											</div>
										))}
									</div>
								)}
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
								<Button type="submit" disabled={isSubmitting || !selectedMethod} className="w-full">
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
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default PaymentMethodPage;
