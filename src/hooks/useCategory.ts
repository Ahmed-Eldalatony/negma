import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export interface Category {
	id: number;
	name: string;
	name_en: string;
	description: string;
	description_en: string;
	image: string;
	is_active: boolean;
	sort_order: number;
	created_at: string;
	updated_at: string;
}

export const useCategory = () => {
	const [data, setData] = useState<Category[] | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);
				const res = await api.get('v1/store/hwm.negma.vercel.app/categories');
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

	console.log('Categories data:', data);
	return { categories: data, loading, error };
};
