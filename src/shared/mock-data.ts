// Types for product and category interfaces
// Mock data has been removed - now using real API data

export interface Product {
	id: string;
	name: string;
	nameAr: string;
	image: string;
	price: number;
	originalPrice?: number;
	discount?: number;
	category: string;
	categoryAr: string;
	inStock: boolean;
	stockCount?: number;
	rating?: number;
	reviewCount?: number;
	description?: string;
	descriptionAr?: string;
	colors?: string[];
	offers?: Offer[];
	specifications?: { label: string; value: string }[];
}

export interface Offer {
	id: string;
	title: string;
	titleAr: string;
	discount: number;
	originalPrice: number;
	newPrice: number;
	isLimited?: boolean;
	limitedCount?: number;
}

export interface Category {
	id: string;
	name: string;
	image: string;
}
