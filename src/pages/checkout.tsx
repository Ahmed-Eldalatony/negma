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

type Country = {
	id: number;
	name: string;
	name_en: string;
	code: string;
	currency: {
		id: number;
		name: string;
		currency: string;
		rate_to_usd: string;
		created_at: string;
		updated_at: string;
	};
	logo: string;
};

type City = {
	id: number;
	name: string;
	name_en: string;
};

// Define the validation schema with Zod
const checkoutSchema = z.object({
	fullName: z.string().min(3, { message: 'الاسم الكامل مطلوب' }),
	country: z.string().min(1, { message: 'الدولة مطلوبة' }),
	city: z.string().min(2, { message: 'المدينة مطلوبة' }),
	primaryPhone: z.string().optional(),
	additionalPhone: z.string().optional(),
	detailedAddress: z.string().min(10, { message: 'العنوان التفصيلي مطلوب' }),
	orderNotes: z.string().optional(),
});

const CheckoutPage = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPayment, setShowPayment] = useState(false);
	const [countries, setCountries] = useState<Country[]>([]);
	const [cities, setCities] = useState<City[]>([]);
	const [selectedCountry, setSelectedCountry] = useState<string>('');
	const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');

	useEffect(() => {
		const fetchCountries = async () => {
			try {
				const response = await api.get('v1/utilities/countries');
				setCountries(response.data.data);
			} catch (error) {
				console.error('Failed to fetch countries:', error);
			}
		};
		fetchCountries();
	}, []);

	useEffect(() => {
		if (selectedCountry) {
			const fetchCities = async () => {
				try {
					const response = await api.get(`v1/utilities/countries/${selectedCountry}/cities`);
					setCities(response.data.data);
				} catch (error) {
					console.error('Failed to fetch cities:', error);
				}
			};
			fetchCities();
		} else {
			setCities([]);
		}
	}, [selectedCountry]);

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
			country: '',
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

	const onSubmit = (data: Record<string, unknown>) => {
		setIsSubmitting(true);
		// Simulate API call
		setTimeout(() => {
			console.log('Order data:', data);
			setIsSubmitting(false);
			setShowPayment(true);
			reset();
		}, 2000);
	};

	if (showPayment) {
		return (
			<PaymentMethodPage
				onPaymentComplete={() => {
					toast({ title: 'نجح الدفع', description: 'تم إتمام الطلب بنجاح' });
					navigate('/orders');
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

								{/* Country */}
								<div className="relative">
									<Label htmlFor="country" className="text-sm font-medium text-foreground mb-1 ">
										الدولة
									</Label>
									<div className="relative">
										<Select
											dir="rtl"
											value={selectedCountry}
											onValueChange={(value) => {
												setSelectedCountry(value);
												setValue('country', value);
												setValue('city', '');
												// Find the country code for phone input
												const country = countries.find((c) => c.id.toString() === value);
												setSelectedCountryCode(country?.code || '');
											}}
										>
											<SelectTrigger className={errors.country ? 'border-destructive' : ''}>
												<SelectValue placeholder="اختر الدولة" />
											</SelectTrigger>
											<SelectContent>
												{countries.map((country) => (
													<SelectItem key={country.id} value={country.id.toString()}>
														{country.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									{errors.country && (
										<p className="mt-1 text-sm text-destructive ">{errors.country.message}</p>
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
											disabled={!selectedCountry}
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
										countryCode={selectedCountryCode}
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
										countryCode={selectedCountryCode}
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
									<span className="text-xl font-bold text-foreground">$125.50</span>
								</div>
							</div>

							{/* Submit Button */}
							<div className="mt-6">
								<Button type="submit" disabled={isSubmitting} className="w-full">
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
											جاري إرسال الطلب...
										</>
									) : (
										'إرسال الطلب'
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

export default CheckoutPage;
