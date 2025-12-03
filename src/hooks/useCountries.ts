import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface Currency {
	id: number;
	name: string;
	currency: string;
	rate_to_usd: string;
	created_at: string;
	updated_at: string;
}

interface Country {
	id: number;
	name: string;
	name_en: string;
	code: string;
	currency: Currency;
	logo: string;
}

export const useCountries = () => {
	return useQuery({
		queryKey: ['countries'],
		queryFn: async (): Promise<Country[]> => {
			const { data } = await api.get('v1/utilities/countries');
			return data.data;
		},
		enabled: typeof window !== 'undefined',
	});
};
