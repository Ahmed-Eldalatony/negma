// src/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products } from '@/shared/mock-data';

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

interface StoreData {
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
	storeData: StoreData | null;
	setStoreData: (data: StoreData) => void;
	clearStoreData: () => void;
}>()(
	persist(
		(set) => ({
			storeData: null,
			setStoreData: (data: StoreData) => set({ storeData: data }),
			clearStoreData: () => set({ storeData: null }),
		}),
		{
			name: 'store-data-storage',
		}
	)
);
