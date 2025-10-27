import { Link } from 'react-router';
import CategoryCard from '@/components/CategoryCard';
import CategoryCardSkeleton from '@/components/CategoryCardSkeleton';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useCategory } from '@/hooks/useCategory';

export default function CategoriesPage() {
	const { categories, loading, error } = useCategory();

	return (
		<div className="bg-background min-h-screen">
			<header className="bg-background sticky top-0 z-40 border-b py-4">
				<div className="flex items-center justify-between">
					<Link to="/">
						<Button variant="ghost" size="icon" data-testid="button-back">
							<ArrowRight className="h-5 w-5" />
						</Button>
					</Link>
					<h1 className="flex-1 text-center text-lg font-bold" data-testid="text-categories-title">
						التصنيفات
					</h1>
					<div className="w-10" />
				</div>
			</header>

			<div className="p-4">
				{loading ? (
					<div className="grid grid-cols-2 gap-4">
						{Array.from({ length: 6 }).map((_, i) => (
							<CategoryCardSkeleton key={i} />
						))}
					</div>
				) : error ? (
					<div className="py-4 text-center text-red-500">Error loading categories</div>
				) : Array.isArray(categories) ? (
					<div className="grid grid-cols-2 gap-4">
						{categories
							.map((cat) => ({ ...cat, id: cat.id.toString() }))
							.map((category) => (
								// Link to individual category page - commented out for now
								// <Link key={category.id} to={`/category/${category.id}`}>
								<CategoryCard category={category} />
								// </Link>
							))}
					</div>
				) : (
					<div className="py-4 text-center">No categories available</div>
				)}
			</div>

			<BottomNav />
		</div>
	);
}
