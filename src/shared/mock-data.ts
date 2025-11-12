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

export const faqs = [
	{
		question: 'كم مدة التوصيل؟',
		answer:
			'التوصيل يستغرق من 2 إلى 4 أيام عمل لجميع مناطق المملكة. نستخدم أفضل شركات الشحن لضمان وصول طلبك بأمان وسرعة.',
	},
	{
		question: 'هل يمكنني الإرجاع أو استرداد المبلغ؟',
		answer:
			'نعم، نوفر ضمان استرجاع المبلغ كاملاً خلال 14 يوم إذا لم تكن راضياً عن المنتج. رضاك هو أولويتنا.',
	},
	{
		question: 'كيف أدفع ثمن المنتج؟',
		answer:
			'نوفر خدمة الدفع عند الاستلام (COD) - لا تدفع أي مبلغ الآن! ادفع فقط عند استلام المنتج من شركة الشحن. آمن ومريح تماماً.',
	},

	{
		question: 'كم سعر التوصيل؟',
		answer:
			'التوصيل مجاني تماماً لجميع مناطق المملكة! لا توجد أي رسوم إضافية أو تكاليف خفية. السعر المعروض هو السعر النهائي.',
	},

	{
		question: 'سياسة الدفع عند الاستلام',
		answer: 'الدفع عند وصول المنتج.',
	},
	{
		question: 'ضمان 30 يوماً',
		answer: 'ضمان استرداد المال في حالة عدم الرضا عن المنتج',
	},
	{
		question: 'الشحن',
		answer: 'شحن مجاني على جميع الطلبات فوق 50$. التوصيل خلال 2-4 أيام عمل',
	},
	{
		question: 'سياسة الإرجاع',
		answer: 'يمكنك إرجاع المنتج خلال 30 يوماً من تاريخ الاستلام',
	},
];
