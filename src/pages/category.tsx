import { ArrowRight, Package } from 'lucide-react';
import { Link, useParams } from 'react-router';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { categories, products } from '@/shared/mock-data';

export function meta({ params }: { params: { id?: string } }) {
	const category = categories.find((c) => c.id === params.id);
	return [
		{ title: `${category?.name || 'تصنيف'} - نجمة` },
		{ name: 'description', content: `تصفح منتجات ${category?.name || 'التصنيف'}` },
	];
}

export default function CategoryPage() {
	const params = useParams();
	const categoryId = params.id || '1';

	const category = categories.find((c) => c.id === categoryId);
	const categoryProducts = products.filter((p) => p.category === categoryId);

	return (
		<div className="bg-background min-h-screen pb-20">
			<header className="bg-background sticky top-0 z-40 border-b p-4">
				<div className="flex items-center justify-between">
					<Link to="/">
						<Button variant="ghost" size="icon" data-testid="button-back">
							<ArrowRight className="h-5 w-5" />
						</Button>
					</Link>
					<h1
						className="flex-1 text-center text-lg font-bold"
						data-testid="text-category-title"
					>
						{category?.name || 'فواكه وخضروات'}
					</h1>
				</div>
			</header>

			<div className="p-4">
				{categoryProducts.length === 0 ? (
					<div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
						<Package className="text-muted-foreground mb-4 h-16 w-16" />
						<h2 className="mb-2 text-xl font-semibold">لا توجد منتجات</h2>
						<p className="text-muted-foreground mb-6">
							لا توجد منتجات متاحة في هذا التصنيف حالياً
						</p>
						<Link to="/categories">
							<Button data-testid="button-browse-categories">
								تصفح التصنيفات الأخرى
							</Button>
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
