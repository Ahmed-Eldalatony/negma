import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useStoreDataStore } from '../store';
import { api } from '../lib/api';

interface Pixel {
	id: string;
	type: string;
}

interface SocialLink {
	link: string;
	platform: string;
}

interface Settings {
	name: string;
	color: string;
	pixel: Pixel[];
	country_id: string;
	description: string;
	social_links: SocialLink[];
}

interface Banner {
	url: string;
	description: string;
}

export interface StoreData {
	id: number;
	name: string;
	domain: string;
	settings: Settings;
	is_active: boolean;
	logo: string;
	favicon: string;
	banners: Banner[];
}

export const useStore = () => {
	const { storeData, setStoreData } = useStoreDataStore();

	const query = useQuery<StoreData>({
		queryKey: ['store'],
		queryFn: async () => {
			try {
				const res = await api.get('v1/store/hwm.negma.vercel.app');
				console.log('======', res);
				return res;
			} catch (error) {
				console.error('API error:', error);
				throw error;
			}
		},
		staleTime: Infinity,
		enabled: !storeData,
	});
	// console.log(query);

	useEffect(() => {
		if (query.isSuccess && query.data) {
			setStoreData(query.data);
		}
	}, [query.isSuccess, query.data, setStoreData]);

	return query.data;
};
