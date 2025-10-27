import { ArrowRight, Package } from 'lucide-react';
import { Link, useParams } from 'react-router';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { useCategory } from '@/hooks/useCategory';
import { useProductsStore } from '@/store';

export function meta() {
	// For meta function, we can't use hooks, so we'll use a simple title
	return [{ title: 'تصنيف - نجمة' }, { name: 'description', content: 'تصفح منتجات التصنيف' }];
}

export default function CategoryPage() {
	const params = useParams();
	const categoryId = params.id || '1';
	const { categories, loading: categoriesLoading, error: categoriesError } = useCategory();
	const { products, isLoading: productsLoading } = useProductsStore();

	const category = categories?.find((c) => c.id.toString() === categoryId);
	// For now, show all products since API doesn't categorize them
	const categoryProducts = products
		? products.slice(0, 10).map((p) => ({
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

	if (categoriesLoading || productsLoading) {
		return (
			<div className="bg-background min-h-screen pb-20">
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

	if (categoriesError) {
		return (
			<div className="flex h-screen items-center justify-center text-red-500">
				خطأ في تحميل البيانات
			</div>
		);
	}

	return (
		<div className="bg-background min-h-screen pb-20">
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

			<div className="p-4">
				{categoryProducts.length === 0 ? (
					<div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
						<Package className="text-muted-foreground mb-4 h-16 w-16" />
						<h2 className="mb-2 text-xl font-semibold">لا توجد منتجات</h2>
						<p className="text-muted-foreground mb-6">لا توجد منتجات متاحة في هذا التصنيف حالياً</p>
						<Link to="/categories">
							<Button data-testid="button-browse-categories">تصفح التصنيفات الأخرى</Button>
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-2 gap-3">
						{categoryProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				)}
			</div>

			<BottomNav />
		</div>
	);
}
