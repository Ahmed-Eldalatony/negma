// TODO: remove mock functionality
// Mock data for design prototype

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

export const categories: Category[] = [
	{
		id: '1',
		name: 'فواكه وخضروات',
		image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400',
	},
	{
		id: '2',
		name: 'حبوب غذائية',
		image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
	},
	{
		id: '3',
		name: 'ألبان ومخبوزات',
		image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
	},
	{
		id: '4',
		name: 'وجبات خفيفة ومشروبات',
		image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f04?w=400',
	},
	{
		id: '5',
		name: 'جمال وعناية شخصية',
		image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
	},
	{
		id: '6',
		name: 'أساسيات المنزل',
		image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
	},
];

export const products: Product[] = [
	{
		id: '1',
		name: 'Classic Backpack',
		nameAr: 'حقيبة الظهر المحدثة الكلاسيكية',
		image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
		price: 33.0,
		originalPrice: 54.5,
		discount: 50,
		category: '1',
		categoryAr: 'حقائب',
		inStock: true,
		stockCount: 15,
		rating: 4.5,
		reviewCount: 6,
		descriptionAr:
			'تتميز حقيبة الظهر المحدثة الكلاسيكية بتصميم أنيق وعملي، تتضمن مقصورة مبطنة لحماية جهاز كبير كبيرة ومريحة وموادعالية الجودة لضمان المتانة واللألوانة.',
		colors: ['#D3D3D3', '#000000', '#4169E1', '#D2691E'],
		offers: [
			{
				id: '1',
				title: 'Buy 2 Get 10% Off',
				titleAr: 'اشتري 2 و احصل على خصم 10%',
				discount: 10,
				originalPrice: 66.0,
				newPrice: 59.4,
			},
			{
				id: '2',
				title: 'Buy 3 Get 15% Off',
				titleAr: 'اشتري 3 و احصل على خصم 15%',
				discount: 15,
				originalPrice: 99.0,
				newPrice: 84.15,
				isLimited: true,
				limitedCount: 30,
			},
		],
		specifications: [
			{ label: 'سياسة الدفع عند الاستلام', value: 'الدفع عند وصول المنتج' },
			{ label: 'ضمان 30 يوماً', value: 'ضمان استرداد في حالة عدم الرضا' },
			{ label: 'شحن مجاني', value: 'عند الشراء بأكثر من 99 دولار' },
			{ label: 'دعم العملاء', value: 'من الإثنين إلى السبت' },
		],
	},
	{
		id: '2',
		name: 'Raw Whole Walnuts',
		nameAr: 'جوز كامل نيء',
		image: 'https://m.media-amazon.com/images/I/61l9NrZfquL._UF894,1000_QL80_.jpg',
		price: 365.0,
		category: '1',
		categoryAr: 'مكسرات',
		inStock: false,
		rating: 4.0,
		reviewCount: 12,
	},
	{
		id: '3',
		name: 'Roasted Salted Cashews',
		nameAr: 'كاجو محمص ومملح',
		image: 'https://plus.unsplash.com/premium_photo-1723978744235-cd52cec7ad38?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=800',
		price: 320.0,
		category: '1',
		categoryAr: 'مكسرات',
		inStock: false,
		rating: 4.2,
		reviewCount: 8,
	},
	{
		id: '4',
		name: 'Roasted Almonds',
		nameAr: 'لوز محمص ومملح',
		image: 'https://senabel.com/wp-content/uploads/2024/11/1-copy-11.png',
		price: 300.0,
		originalPrice: 350.0,
		discount: 15,
		category: '1',
		categoryAr: 'مكسرات',
		inStock: false,
		rating: 4.5,
		reviewCount: 15,
	},
	{
		id: '5',
		name: 'Fresh Mangoes',
		nameAr: 'مانجو طازجة',
		image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800',
		price: 89.0,
		originalPrice: 120.0,
		discount: 9,
		category: '1',
		categoryAr: 'فواكه',
		inStock: true,
		stockCount: 25,
		rating: 4.8,
		reviewCount: 20,
	},
	{
		id: '6',
		name: 'Fresh Peaches',
		nameAr: 'خوخ طازج',
		image: 'https://freshleafuae.com/wp-content/uploads/2024/08/honey-peach-premium-freshleaf-dubai-uae-img01.jpg',
		price: 95.0,
		originalPrice: 110.0,
		discount: 20,
		category: '1',
		categoryAr: 'فواكه',
		inStock: true,
		stockCount: 18,
		rating: 4.6,
		reviewCount: 14,
	},
];
