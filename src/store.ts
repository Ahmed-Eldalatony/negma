// src/store.ts
import { create } from 'zustand';
import { pixelTracker } from './lib/pixelTracking';

export const SUBDOMAIN = () => {
	if (process.env.NODE_ENV === 'development') {
		return 'hwm';
	}
	const parts = window.location.hostname.split('.');
	if (parts.length <= 2) return ''; // مفيش subdomain
	// هنا نعتبر أن الدومين هو آخر قطعتين
	if (parts.length <= 2) return parts[0]; // مفيش SUBDOMAIN()
	console.log(parts.slice(0, -2).join('.'));
	return parts.slice(0, -2).join('.');
	// return 'hwm';
};

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

export const useCounterStore = create<{
	count: number;
	increment: () => void;
	reset: () => void;
}>((set) => ({
	count: 0,
	increment: () => set((state) => ({ count: state.count + 1 })),
	reset: () => set({ count: 0 }),
}));

export const useCartStore = create<{
	cart: { id: string; quantity: number }[];
	addToCart: (productId: string, quantity?: number) => void;
	removeFromCart: (productId: string) => void;
	updateQuantity: (productId: string, quantity: number) => void;
	clearCart: () => void;
	getCartItemCount: () => number;
	isInCart: (productId: string) => boolean;
}>()((set, get) => {
	// Load initial state from localStorage
	const loadFromStorage = () => {
		if (typeof window === 'undefined') return [];
		try {
			const stored = localStorage.getItem('cart-storage');
			const parsed = stored ? JSON.parse(stored) : [];
			return Array.isArray(parsed) ? parsed : [];
		} catch {
			return [];
		}
	};

	// Save to localStorage
	const saveToStorage = (cart: { id: string; quantity: number }[]) => {
		if (typeof window === 'undefined') return;
		try {
			localStorage.setItem('cart-storage', JSON.stringify(cart));
		} catch (error) {
			console.error('Failed to save cart to localStorage:', error);
		}
	};

	return {
		cart: loadFromStorage(),
		addToCart: (productId: string, quantity = 1) =>
			set((state) => {
				const existingItem = state.cart.find((item) => item.id === productId);
				let newCart;
				if (existingItem) {
					newCart = state.cart.map((item) =>
						item.id === productId ? { ...item, quantity: item.quantity + quantity } : item
					);
				} else {
					newCart = [...state.cart, { id: productId, quantity }];
				}
				saveToStorage(newCart);
				// Track add to cart event
				pixelTracker.trackEventForAll('AddToCart', {
					content_ids: [productId],
					quantity,
					content_type: 'product',
				});
				return { cart: newCart };
			}),
		removeFromCart: (productId: string) =>
			set((state) => {
				const newCart = state.cart.filter((item) => item.id !== productId);
				saveToStorage(newCart);
				return { cart: newCart };
			}),
		updateQuantity: (productId: string, quantity: number) =>
			set((state) => {
				const newCart = state.cart.map((item) =>
					item.id === productId ? { ...item, quantity } : item
				);
				saveToStorage(newCart);
				return { cart: newCart };
			}),
		clearCart: () => {
			saveToStorage([]);
			set({ cart: [] });
		},
		getCartItemCount: () => get().cart.reduce((total, item) => total + item.quantity, 0),
		isInCart: (productId: string) => get().cart.some((item) => item.id === productId),
	};
});

export const useStoreCountryStore = create<{
	storeCountryId: string | null;
	setStoreCountryId: (countryId: string) => void;
	clearStoreCountryId: () => void;
}>()((set) => ({
	storeCountryId: null,
	setStoreCountryId: (countryId: string) => set({ storeCountryId: countryId }),
	clearStoreCountryId: () => set({ storeCountryId: null }),
}));
