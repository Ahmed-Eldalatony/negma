import { useQuery } from '@tanstack/react-query';
import { SUBDOMAIN } from '@/store';
import { api } from '@/lib/api';

interface Product {
	id: number;
	name: string;
	description: string;
	inventory: number;
	prices: { id: number; min_quantity: number; price_in_usd: string }[];
	media: {
		id: number;
		file_name: string;
		size: string;
		human_readable_size: string;
		url: string;
		type: string;
	}[];
	variants: {
		id: number;
		sku: string;
		options: { value: string; attribute: string }[];
		inventory: number;
	}[];
	reviews: {
		id: number;
		customer_name: string;
		rating: number;
		title: string;
		body: string;
		created_at: string;
		updated_at: string;
	}[];
}

// Fetch all products
export const useProducts = () => {
	return useQuery({
		queryKey: ['products'],
		queryFn: async (): Promise<Product[]> => {
			const { data } = await api.get(`v1/store/${SUBDOMAIN()}/products`);
			return data.data;
		},
		enabled: typeof window !== 'undefined', // Prevent server-side execution
	});
};

// Fetch products by category
export const useProductsByCategory = (categoryId: string | undefined) => {
	return useQuery({
		queryKey: ['products', 'category', categoryId],
		queryFn: async (): Promise<Product[]> => {
			const { data } = await api.get(`v1/store/${SUBDOMAIN()}/products?category_id=${categoryId}`);
			return data.data;
		},
		enabled: typeof window !== 'undefined' && !!categoryId,
	});
};

// Fetch products with filters
export const useProductsWithFilters = (categoryId?: string, search?: string) => {
	return useQuery({
		queryKey: ['products', 'filtered', { categoryId, search }],
		queryFn: async (): Promise<Product[]> => {
			const params = new URLSearchParams();
			if (categoryId) params.append('category_id', categoryId);
			if (search) params.append('search', search);
			const queryString = params.toString();

			const endpoint = `v1/store/${SUBDOMAIN()}/products${queryString ? `?${queryString}` : ''}`;
			const { data } = await api.get(endpoint);
			return data.data;
		},
		enabled: typeof window !== 'undefined',
	});
};

// Fetch single product
export const useProduct = (id: string | undefined) => {
	return useQuery({
		queryKey: ['product', id],
		queryFn: async (): Promise<Product> => {
			const { data } = await api.get(`v1/store/${SUBDOMAIN()}/products/${id}`);
			return data.data;
		},
		enabled: typeof window !== 'undefined' && !!id,
	});
};
