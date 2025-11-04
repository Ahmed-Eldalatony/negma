import { useQuery } from '@tanstack/react-query';
import { SUBDOMAIN } from '@/store';

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
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000);

			try {
				const response = await fetch(`https://boddasaad.me/api/v1/store/${SUBDOMAIN()}/products`, {
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
		enabled: typeof window !== 'undefined', // Prevent server-side execution
	});
};

// Fetch products by category
export const useProductsByCategory = (categoryId: string | undefined) => {
	return useQuery({
		queryKey: ['products', 'category', categoryId],
		queryFn: async (): Promise<Product[]> => {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000);

			try {
				const response = await fetch(
					`https://boddasaad.me/api/v1/store/${SUBDOMAIN()}/products?category_id=${categoryId}`,
					{
						signal: controller.signal,
					}
				);

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
		enabled: typeof window !== 'undefined' && !!categoryId,
	});
};

// Fetch products with filters
export const useProductsWithFilters = (categoryId?: string, search?: string) => {
	return useQuery({
		queryKey: ['products', 'filtered', { categoryId, search }],
		queryFn: async (): Promise<Product[]> => {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000);

			try {
				const params = new URLSearchParams();
				if (categoryId) params.append('category_id', categoryId);
				if (search) params.append('search', search);
				const queryString = params.toString();

				const url = `https://boddasaad.me/api/v1/store/${SUBDOMAIN()}/products${queryString ? `?${queryString}` : ''}`;

				const response = await fetch(url, {
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

// Fetch single product
export const useProduct = (id: string | undefined) => {
	return useQuery({
		queryKey: ['product', id],
		queryFn: async (): Promise<Product> => {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000);

			try {
				const response = await fetch(
					`https://boddasaad.me/api/v1/store/${SUBDOMAIN()}/products/${id}`,
					{
						signal: controller.signal,
					}
				);

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
		enabled: typeof window !== 'undefined' && !!id,
	});
};
