// src/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products } from '@/shared/mock-data';

const domain = 'hwm.negma.vercel.app';

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

interface Category {
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

export const useCounterStore = create<{
	count: number;
	increment: () => void;
	reset: () => void;
}>((set) => ({
	count: 0,
	increment: () => set((state) => ({ count: state.count + 1 })),
	reset: () => set({ count: 0 }),
}));

export const useFavoritesStore = create<{
	favorites: string[];
	addFavorite: (productId: string) => void;
	removeFavorite: (productId: string) => void;
	toggleFavorite: (productId: string) => void;
	isFavorite: (productId: string) => boolean;
}>()(
	persist(
		(set, get) => ({
			favorites: [],
			addFavorite: (productId: string) =>
				set((state) => ({
					favorites: [...new Set([...state.favorites, productId])],
				})),
			removeFavorite: (productId: string) =>
				set((state) => ({
					favorites: state.favorites.filter((id) => id !== productId),
				})),
			toggleFavorite: (productId: string) => {
				const { favorites, addFavorite, removeFavorite } = get();
				if (favorites.includes(productId)) {
					removeFavorite(productId);
				} else {
					addFavorite(productId);
				}
			},
			isFavorite: (productId: string) => get().favorites.includes(productId),
		}),
		{
			name: 'favorites-storage',
		}
	)
);

export const useCartStore = create<{
	cart: { id: string; quantity: number }[];
	addToCart: (productId: string, quantity?: number) => void;
	removeFromCart: (productId: string) => void;
	updateQuantity: (productId: string, quantity: number) => void;
	clearCart: () => void;
	getCartItemCount: () => number;
	isInCart: (productId: string) => boolean;
	getCartTotal: () => number;
}>()(
	persist(
		(set, get) => ({
			cart: [],
			addToCart: (productId: string, quantity = 1) =>
				set((state) => {
					const existingItem = state.cart.find((item) => item.id === productId);
					if (existingItem) {
						return {
							cart: state.cart.map((item) =>
								item.id === productId
									? { ...item, quantity: item.quantity + quantity }
									: item
							),
						};
					} else {
						return {
							cart: [...state.cart, { id: productId, quantity }],
						};
					}
				}),
			removeFromCart: (productId: string) =>
				set((state) => ({
					cart: state.cart.filter((item) => item.id !== productId),
				})),
			updateQuantity: (productId: string, quantity: number) =>
				set((state) => ({
					cart: state.cart.map((item) =>
						item.id === productId ? { ...item, quantity } : item
					),
				})),
			clearCart: () => set({ cart: [] }),
			getCartItemCount: () => get().cart.reduce((total, item) => total + item.quantity, 0),
			isInCart: (productId: string) => get().cart.some((item) => item.id === productId),
			getCartTotal: () => {
				const cart = get().cart;
				return cart.reduce((total, item) => {
					const product = products.find((p) => p.id === item.id);
					return total + (product ? product.price * item.quantity : 0);
				}, 0);
			},
		}),
		{
			name: 'cart-storage',
		}
	)
);

export const useStoreDataStore = create<{
	storedData: StoreData | null;
	setStoredData: (data: StoreData) => void;
	clearStoredData: () => void;
	isLoading: boolean;
	setLoading: (isLoading: boolean) => void;
	error: string | null;
	setError: (error: string | null) => void;
	fetchStoreData: () => Promise<void>;
}>()(
	persist(
		(set) => ({
			storedData: null,
			setStoredData: (data: StoreData) => set({ storedData: data }),
			clearStoredData: () => set({ storedData: null }),
			isLoading: false,
			setLoading: (isLoading: boolean) => set({ isLoading }),
			error: null,
			setError: (error: string | null) => set({ error }),
			fetchStoreData: async () => {
				if (typeof window === 'undefined') return; // Prevent server-side execution

				try {
					set({ isLoading: true, error: null });

					// Add timeout to the fetch request
					const controller = new AbortController();
					const timeoutId = setTimeout(() => controller.abort(), 10000);

					const response = await fetch(`https://boddasaad.me/api/v1/store/${domain}`, {
						signal: controller.signal,
					});

					clearTimeout(timeoutId);

					if (!response.ok) {
						throw new Error(`API error: ${response.status} ${response.statusText}`);
					}

					const result = await response.json();
					// Ensure we're extracting the inner 'data' property
					const storedData: StoreData = result.data.data;

					set({ storedData, isLoading: false });
				} catch (error) {
					if (error instanceof Error && error.name === 'AbortError') {
						console.error('Store data request timeout:', error);
						set({
							error: 'Request timeout',
							isLoading: false,
						});
					} else {
						console.error('Error fetching store data:', error);
						set({
							error: error instanceof Error ? error.message : 'An error occurred',
							isLoading: false,
						});
					}
				}
			},
		}),
		{
			name: 'store-data-storage',
		}
	)
);

export const useCategoriesStore = create<{
	categories: Category[] | null;
	setCategories: (data: Category[]) => void;
	clearCategories: () => void;
	isLoading: boolean;
	setLoading: (isLoading: boolean) => void;
	error: string | null;
	setError: (error: string | null) => void;
	fetchCategories: () => Promise<void>;
}>()(
	persist(
		(set) => ({
			categories: null,
			setCategories: (data: Category[]) => set({ categories: data }),
			clearCategories: () => set({ categories: null }),
			isLoading: false,
			setLoading: (isLoading: boolean) => set({ isLoading }),
			error: null,
			setError: (error: string | null) => set({ error }),
			fetchCategories: async () => {
				if (typeof window === 'undefined') return; // Prevent server-side execution

				try {
					set({ isLoading: true, error: null });

					// Add timeout to the fetch request
					const controller = new AbortController();
					const timeoutId = setTimeout(() => controller.abort(), 10000);

					const response = await fetch(
						`https://boddasaad.me/api/v1/store/${domain}/categories`,
						{
							signal: controller.signal,
						}
					);

					clearTimeout(timeoutId);

					if (!response.ok) {
						throw new Error(`API error: ${response.status} ${response.statusText}`);
					}

					const result = await response.json();
					const categories: Category[] = result.data;

					set({ categories, isLoading: false });
				} catch (error) {
					if (error instanceof Error && error.name === 'AbortError') {
						console.error('Categories request timeout:', error);
						set({
							error: 'Request timeout',
							isLoading: false,
						});
					} else {
						console.error('Error fetching categories:', error);
						set({
							error: error instanceof Error ? error.message : 'An error occurred',
							isLoading: false,
						});
					}
				}
			},
		}),
		{
			name: 'categories-storage',
		}
	)
);

export const useProductsStore = create<{
	products: Product[] | null;
	setProducts: (data: Product[]) => void;
	clearProducts: () => void;
	currentProduct: Product | null;
	setCurrentProduct: (data: Product) => void;
	clearCurrentProduct: () => void;
	isLoading: boolean;
	setLoading: (isLoading: boolean) => void;
	error: string | null;
	setError: (error: string | null) => void;
	fetchProducts: () => Promise<void>;
	fetchProduct: (id: string) => Promise<void>;
}>()(
	persist(
		(set) => ({
			products: null,
			setProducts: (data: Product[]) => set({ products: data }),
			clearProducts: () => set({ products: null }),
			currentProduct: null,
			setCurrentProduct: (data: Product) => set({ currentProduct: data }),
			clearCurrentProduct: () => set({ currentProduct: null }),
			isLoading: false,
			setLoading: (isLoading: boolean) => set({ isLoading }),
			error: null,
			setError: (error: string | null) => set({ error }),
			fetchProducts: async () => {
				if (typeof window === 'undefined') return; // Prevent server-side execution

				try {
					set({ isLoading: true, error: null });

					// Add timeout to the fetch request
					const controller = new AbortController();
					const timeoutId = setTimeout(() => controller.abort(), 10000);

					const response = await fetch(
						`https://boddasaad.me/api/v1/store/${domain}/products`,
						{
							signal: controller.signal,
						}
					);

					clearTimeout(timeoutId);

					if (!response.ok) {
						throw new Error(`API error: ${response.status} ${response.statusText}`);
					}

					const result = await response.json();
					const products: Product[] = result.data;

					set({ products, isLoading: false });
				} catch (error) {
					if (error instanceof Error && error.name === 'AbortError') {
						console.error('Products request timeout:', error);
						set({
							error: 'Request timeout',
							isLoading: false,
						});
					} else {
						console.error('Error fetching products:', error);
						set({
							error: error instanceof Error ? error.message : 'An error occurred',
							isLoading: false,
						});
					}
				}
			},
			fetchProduct: async (id: string) => {
				if (typeof window === 'undefined') return; // Prevent server-side execution

				try {
					set({ isLoading: true, error: null });

					// Add timeout to the fetch request
					const controller = new AbortController();
					const timeoutId = setTimeout(() => controller.abort(), 10000);

					const response = await fetch(
						`https://boddasaad.me/api/v1/store/${domain}/products/${id}`,
						{
							signal: controller.signal,
						}
					);

					clearTimeout(timeoutId);

					if (!response.ok) {
						throw new Error(`API error: ${response.status} ${response.statusText}`);
					}

					const result = await response.json();
					const product: Product = result.data;

					set({ currentProduct: product, isLoading: false });
				} catch (error) {
					if (error instanceof Error && error.name === 'AbortError') {
						console.error('Product request timeout:', error);
						set({
							error: 'Request timeout',
							isLoading: false,
						});
					} else {
						console.error('Error fetching product:', error);
						set({
							error: error instanceof Error ? error.message : 'An error occurred',
							isLoading: false,
						});
					}
				}
			},
		}),
		{
			name: 'products-storage',
		}
	)
);
