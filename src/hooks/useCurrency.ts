import { useMemo } from 'react';
import { useCountries } from './useCountries';
import { useStoreCountryStore } from '@/store';

export const useCurrency = () => {
	const { data: countries, isLoading, error } = useCountries();
	const { storeCountryId } = useStoreCountryStore();

	const currentCurrency = useMemo(() => {
		if (!countries || !storeCountryId) return null;

		const country = countries.find((c) => c.id.toString() === storeCountryId);
		return country?.currency || null;
	}, [countries, storeCountryId]);

	return {
		currency: currentCurrency,
		isLoading,
		error,
	};
};
