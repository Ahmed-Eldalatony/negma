import { ArrowRight, Package } from 'lucide-react'; // Icons for UI elements
import { Link, useParams } from 'react-router'; // React Router for navigation and URL params
import ProductCard from '@/components/ProductCard'; // Component to display individual products
import ProductCardSkeleton from '@/components/ProductCardSkeleton'; // Loading skeleton for products
import BottomNav from '@/components/BottomNav'; // Bottom navigation component
import { Button } from '@/components/ui/button'; // UI button component
import { useCategory } from '@/hooks/useCategory'; // Custom hook to fetch categories
import { useProductsByCategory } from '@/hooks/useProducts'; // React Query hook for products by category

import type { Product } from '@/shared/mock-data';

// Meta function for SEO - provides page title and description
// Cannot use hooks here as it's a static function
export function meta() {
	return [{ title: 'تصنيف - نجمة' }, { name: 'description', content: 'تصفح منتجات التصنيف' }];
}

// Main component for the category page
export default function CategoryPage() {
	// Get category ID from URL params
	const params = useParams();
	const categoryId = params.id;

	// Fetch categories data using custom hook
	const { categories, loading: categoriesLoading, error: categoriesError } = useCategory();
	// Get products by category using React Query
	const { data: categoryProducts, isLoading: productsLoading } = useProductsByCategory(categoryId);

	// Find the current category by ID
	const category = categories?.find((c) => c.id.toString() === categoryId);

	// Transform products data to match ProductCard component props
	const transformedProducts: Product[] = categoryProducts
		? categoryProducts.map((p) => ({
				id: p.id.toString(),
				name: p.name,
				nameAr: p.name,
				image: p.media[0]?.url || '',
				price: parseFloat(p.prices[0]?.price_in_usd || '0'),
				originalPrice: undefined,
				discount: undefined,
				category: '',
				categoryAr: '',
				inStock: p.inventory > 0,
				stockCount: p.inventory,
				rating: undefined,
				reviewCount: undefined,
				description: p.description,
				descriptionAr: p.description,
				colors: undefined,
				offers: undefined,
			}))
		: [];

	// Show loading state while fetching data
	if (categoriesLoading || productsLoading) {
		return (
			<div className="bg-background w-sm min-h-screen pb-20">
				{/* Header with back button and category title */}
				<header className="bg-background sticky top-0 z-40 border-b p-4">
					<div className="flex items-center justify-between">
						<Link to="/">
							<Button variant="ghost" size="icon" data-testid="button-back">
								<ArrowRight className="h-5 w-5" />
							</Button>
						</Link>
						<h1 className="flex-1 text-center text-lg font-bold" data-testid="text-category-title">
							{category?.name || 'التصنيف'}
						</h1>
					</div>
				</header>
				{/* Loading skeletons for products */}
				<div className="p-4">
					<div className="grid grid-cols-2 gap-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<ProductCardSkeleton key={i} />
						))}
					</div>
				</div>
				<BottomNav />
			</div>
		);
	}

	// Show error state if categories failed to load
	if (categoriesError) {
		return (
			<div className="flex h-screen items-center justify-center text-red-500">
				خطأ في تحميل البيانات
			</div>
		);
	}

	// Main render for loaded state
	return (
		<div className="bg-background min-h-screen pb-20">
			{/* Header with back button and category title */}
			<header className="bg-background sticky top-0 z-40 border-b p-4">
				<div className="flex items-center justify-between">
					<Link to="/">
						<Button variant="ghost" size="icon" data-testid="button-back">
							<ArrowRight className="h-5 w-5" />
						</Button>
					</Link>
					<h1 className="flex-1 text-center text-lg font-bold" data-testid="text-category-title">
						{category?.name || 'فواكه وخضروات'}
					</h1>
				</div>
			</header>

			{/* Main content area */}
			<div className="p-4">
				{/* Show empty state if no products */}
				{transformedProducts.length === 0 ? (
					<div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
						<Package className="text-muted-foreground mb-4 h-16 w-16" />
						<h2 className="mb-2 text-xl font-semibold">لا توجد منتجات</h2>
						<p className="text-muted-foreground mb-6">لا توجد منتجات متاحة في هذا التصنيف حالياً</p>
						<Link to="/categories">
							<Button data-testid="button-browse-categories">تصفح التصنيفات الأخرى</Button>
						</Link>
					</div>
				) : (
					// Grid of product cards
					<div className="grid grid-cols-2 gap-3">
						{transformedProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				)}
			</div>

			{/* Bottom navigation */}
			<BottomNav />
		</div>
	);
}
