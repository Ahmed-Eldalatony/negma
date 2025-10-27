import { useEffect, useState } from 'react';
// import { useStoreDataStore } from '../store';
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
	const [data, setData] = useState<StoreData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);
				const res = await api.get('v1/store/hwm.negma.vercel.app');
				setData(res.data.data);
			} catch (err) {
				console.error('API error:', err);
				setError(err instanceof Error ? err.message : 'An error occurred');
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	console.log('Store data:', data);
	return { storedData: data, loading, error };
};
