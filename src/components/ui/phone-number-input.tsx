import React, { useState, useEffect, useCallback } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// --- Data and Types ---

// 1. Define a clear type for a country object
type Country = {
	name: string;
	nameAr: string;
	code: string;
	dialCode: string;
	flag: string;
	minLength: number;
	maxLength: number;
};

// 2. Define the list of countries with the new type
const GCC_COUNTRIES: Country[] = [
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
	},
].sort((a, b) => a.nameAr.localeCompare(b.nameAr));

// 3. Set a specific, reliable default country
const DEFAULT_COUNTRY = GCC_COUNTRIES.find((c) => c.code === 'SA') || GCC_COUNTRIES[0];

// --- Helper Function ---

// A utility to parse the full phone number string (the `value` prop)
const parsePhoneNumber = (value: string | undefined): { country: Country; number: string } => {
	if (!value) {
		return { country: DEFAULT_COUNTRY, number: '' };
	}

	// Find the country that matches the dial code prefix
	const matchedCountry = GCC_COUNTRIES.find((c) => value.startsWith(c.dialCode));

	if (matchedCountry) {
		const number = value.substring(matchedCountry.dialCode.length);
		return { country: matchedCountry, number };
	}

	// Special case for Egyptian numbers that might start with '0' instead of '+20'
	if (value.startsWith('0') && value.length > 1) {
		const egypt = GCC_COUNTRIES.find((c) => c.code === 'EG');
		if (egypt) {
			return { country: egypt, number: value.substring(1) };
		}
	}

	// If no match, return the default country and assume the value is the number
	return { country: DEFAULT_COUNTRY, number: value.replace(/\D/g, '') };
};

// --- Component Definition ---

interface GccPhoneInputProps {
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
}

export const GccPhoneInput = ({ value, onChange, className }: GccPhoneInputProps) => {
	// --- State Management ---

	// Initialize state directly from the `value` prop using the helper function
	const [selectedCountry, setSelectedCountry] = useState<Country>(
		() => parsePhoneNumber(value).country
	);
	const [phoneNumber, setPhoneNumber] = useState<string>(() => parsePhoneNumber(value).number);
	const [error, setError] = useState('');

	// --- Effects ---

	// Effect to synchronize the component's state when the `value` prop changes externally
	useEffect(() => {
		const { country, number } = parsePhoneNumber(value);
		setSelectedCountry(country);
		setPhoneNumber(number);
	}, [value]);

	// Effect for validation, runs whenever the number or country changes
	useEffect(() => {
		if (phoneNumber.length === 0) {
			setError(''); // Clear error if input is empty
			return;
		}

		let errorMessage = '';
		if (phoneNumber.length < selectedCountry.minLength) {
			errorMessage = `يجب أن يكون ${selectedCountry.minLength} أرقام`;
		} else if (phoneNumber.length > selectedCountry.maxLength) {
			errorMessage = `الرقم طويل جدًا`; // Keep it short, the number will be truncated anyway
		}
		setError(errorMessage);
	}, [phoneNumber, selectedCountry]);

	// --- Event Handlers ---

	// Wrapped in useCallback for performance optimization
	const handleCountryChange = useCallback(
		(countryCode: string) => {
			const newCountry = GCC_COUNTRIES.find((c) => c.code === countryCode);
			if (newCountry) {
				setSelectedCountry(newCountry);
				// When country changes, construct and emit the new full number
				const fullNumber = newCountry.dialCode + phoneNumber;
				onChange?.(fullNumber);
			}
		},
		[phoneNumber, onChange]
	);

	// Wrapped in useCallback for performance optimization
	const handlePhoneNumberChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const digitsOnly = e.target.value.replace(/\D/g, '');
			// Enforce max length constraint
			const newPhoneNumber = digitsOnly.slice(0, selectedCountry.maxLength);

			setPhoneNumber(newPhoneNumber);
			// Construct and emit the new full number on every change
			const fullNumber = selectedCountry.dialCode + newPhoneNumber;
			onChange?.(fullNumber);
		},
		[selectedCountry, onChange]
	);

	return (
		<div className={cn('space-y-2', className)}>
			<div className="relative">
				<Select value={selectedCountry.code} onValueChange={handleCountryChange}>
					<SelectTrigger className="absolute left-2 top-1/2 -translate-y-1/2 w-auto h-auto p-0 border-0 bg-transparent z-10 focus:ring-0 focus:ring-offset-0">
						<SelectValue>
							<div className="flex items-center space-x-1">
								<span className="text-lg">{selectedCountry.flag}</span>
								<span className="text-sm text-muted-foreground">{selectedCountry.dialCode}</span>
							</div>
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{GCC_COUNTRIES.map((country) => (
							<SelectItem key={country.code} value={country.code}>
								<div className="flex items-center space-x-2 text-right">
									<span>{country.flag}</span>
									<span>{country.nameAr}</span>
									<span className="text-muted-foreground">{country.dialCode}</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Input
					type="tel"
					dir="ltr" // Ensure phone number input is always Left-to-Right
					value={phoneNumber}
					onChange={handlePhoneNumberChange}
					placeholder={`${'X'.repeat(selectedCountry.minLength)}`}
					className={cn('pl-28 text-left', error && 'border-red-500 focus-visible:ring-red-500')}
				/>
			</div>

			{error && <p className="text-sm text-red-500 font-medium">{error}</p>}
		</div>
	);
};
