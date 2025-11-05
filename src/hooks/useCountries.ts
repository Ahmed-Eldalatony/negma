import { useQuery } from '@tanstack/react-query';

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
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000);

			try {
				const response = await fetch('https://boddasaad.me/api/v1/utilities/countries', {
					signal: controller.signal,
				});

				clearTimeout(timeoutId);

				if (!response.ok) {
					throw new Error(`API error: ${response.status} ${response.statusText}`);
				}

				const result = await response.json();
				return result.data;
			} catch (error) {
				clearTimeout(timeoutId);
				if (error instanceof Error && error.name === 'AbortError') {
					throw new Error('Request timeout');
				}
				throw error;
			}
		},
		enabled: typeof window !== 'undefined',
	});
};
