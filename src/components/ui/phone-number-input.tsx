import React, { useState, useEffect } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// 1. Updated data for GCC countries and Egypt
const GCC_COUNTRIES = [
	{
		name: 'Bahrain',
		nameAr: 'البحرين',
		code: 'BH',
		dialCode: '+973',
		flag: '🇧🇭',
		minLength: 8,
		maxLength: 8,
	},
	{
		name: 'Egypt',
		nameAr: 'مصر',
		code: 'EG',
		dialCode: '+20',
		flag: '🇪🇬',
		minLength: 10,
		maxLength: 10,
	},
	{
		name: 'Kuwait',
		nameAr: 'الكويت',
		code: 'KW',
		dialCode: '+965',
		flag: '🇰🇼',
		minLength: 8,
		maxLength: 8,
	},
	{
		name: 'Oman',
		nameAr: 'عمان',
		code: 'OM',
		dialCode: '+968',
		flag: '🇴🇲',
		minLength: 8,
		maxLength: 8,
	},
	{
		name: 'Qatar',
		nameAr: 'قطر',
		code: 'QA',
		dialCode: '+974',
		flag: '🇶🇦',
		minLength: 8,
		maxLength: 8,
	},
	{
		name: 'Saudi Arabia',
		nameAr: 'السعودية',
		code: 'SA',
		dialCode: '+966',
		flag: '🇸🇦',
		minLength: 9,
		maxLength: 9,
	},
	{
		name: 'UAE',
		nameAr: 'الإمارات',
		code: 'AE',
		dialCode: '+971',
		flag: '🇦🇪',
		minLength: 8,
		maxLength: 9,
	}, // Mobile is 8, landlines can be 9
].sort((a, b) => a.nameAr.localeCompare(b.nameAr)); // Sort alphabetically by Arabic name

// Define the component's props
interface GccPhoneInputProps {
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
	countryCode?: string; // ISO country code (e.g., 'EG', 'SA') to control the selected country
}

export const GccPhoneInput = ({ value, onChange, className, countryCode }: GccPhoneInputProps) => {
	// Default to the first country in the list (Bahrain after sorting)
	const defaultCountry = GCC_COUNTRIES[0];

	const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
	const [phoneNumber, setPhoneNumber] = useState('');
	const [error, setError] = useState('');

	// Update selected country when countryCode prop changes
	useEffect(() => {
		if (countryCode) {
			const country = GCC_COUNTRIES.find((c) => c.code === countryCode);
			if (country) {
				setSelectedCountry(country);
			}
		}
	}, [countryCode]);

	// --- Validation Function ---
	const validateNumber = (number: string, country: typeof defaultCountry) => {
		if (number.length === 0) {
			return '';
		}
		if (number.length < country.minLength) {
			return `قصير جداً. يجب أن يكون ${country.minLength}-${country.maxLength} أرقام.`;
		}
		if (number.length > country.maxLength) {
			return `طويل جداً. يجب أن يكون ${country.minLength}-${country.maxLength} أرقام.`;
		}
		return '';
	};

	// Effect to parse an initial value prop
	useEffect(() => {
		if (value) {
			let country = GCC_COUNTRIES.find((c) => value.startsWith(c.dialCode));
			let number = '';
			if (country) {
				number = value.slice(country.dialCode.length);
			} else if (value.startsWith('0')) {
				// Assume Egypt
				country = GCC_COUNTRIES.find((c) => c.code === 'EG');
				number = value.slice(1);
			}
			if (country) {
				setSelectedCountry(country);
				setPhoneNumber(number);
				setError(validateNumber(number, country));
			}
		} else {
			setPhoneNumber('');
			setError('');
		}
	}, [value]);

	// Effect to emit the full number and validate
	useEffect(() => {
		// Return just the phone number digits for API compatibility
		if (onChange) {
			onChange(phoneNumber);
		}
		setError(validateNumber(phoneNumber, selectedCountry));
	}, [selectedCountry, phoneNumber, onChange]);

	const handleCountryChange = (countryCode: string) => {
		const country = GCC_COUNTRIES.find((c) => c.code === countryCode);
		if (country) {
			setSelectedCountry(country);
			setError(validateNumber(phoneNumber, country));
		}
	};

	const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const digitsOnly = e.target.value.replace(/\D/g, '');
		setPhoneNumber(digitsOnly);
	};

	return (
		<div className={cn('space-y-2', className)}>
			<div className="relative">
				{/* Country Selector nested in input */}
				<Select
					value={selectedCountry.code}
					onValueChange={handleCountryChange}
					disabled={!!countryCode}
				>
					<SelectTrigger className="absolute left-2 top-1/2 -translate-y-1/2 w-auto h-auto p-0 border-0 bg-transparent z-10">
						<SelectValue>
							<div className="flex items-center">
								<span className="text-sm text-muted-foreground">{selectedCountry.dialCode}</span>
							</div>
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{GCC_COUNTRIES.map((country) => (
							<SelectItem key={country.code} value={country.code}>
								<div className="flex items-center space-x-2">
									<span>{country.flag}</span>
									<span>{country.nameAr}</span>
									<span className="text-muted-foreground">{country.dialCode}</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Phone Number Input */}
				<Input
					type="tel"
					value={phoneNumber}
					onChange={handlePhoneNumberChange}
					placeholder={`مثال: ${'x'.repeat(selectedCountry.minLength)}`}
					className={cn('pl-20', error && 'border-red-500 focus-visible:ring-red-500')}
				/>
			</div>
			{/* Error Message Display */}
			{error && <p className="text-sm text-red-500 font-medium">{error}</p>}
		</div>
	);
};
