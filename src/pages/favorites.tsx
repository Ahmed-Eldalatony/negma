import { ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router';
import { useFavoritesStore } from '@/store';
import { products } from '@/shared/mock-data';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';

export default function FavoritesPage() {
	const { favorites } = useFavoritesStore();

	const favoriteProducts = products.filter((product) => favorites.includes(product.id));

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
						data-testid="text-favorites-title"
					>
						المفضلة ({favorites.length})
					</h1>
					<div className="w-10" /> {/* Spacer for centering */}
				</div>
			</header>

			<div className="p-4">
				{favoriteProducts.length === 0 ? (
					<div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
						<Heart className="text-muted-foreground mb-4 h-16 w-16" />
						<h2 className="mb-2 text-xl font-semibold">لا توجد منتجات مفضلة</h2>
						<p className="text-muted-foreground mb-6">
							اضف منتجات إلى مفضلتك بالضغط على القلب عند التمرير على المنتج
						</p>
						<Link to="/">
							<Button data-testid="button-browse">تصفح المنتجات</Button>
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-2 gap-3">
						{favoriteProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				)}
			</div>

			<BottomNav />
		</div>
	);
}
