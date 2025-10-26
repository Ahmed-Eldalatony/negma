import { Link } from 'react-router';
import { categories } from '@/shared/mock-data';
import CategoryCard from '@/components/CategoryCard';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CategoriesPage() {
	return (
		<div className="bg-background min-h-screen">
			<header className="bg-background sticky top-0 z-40 border-b py-4">
				<div className="flex items-center justify-between">
					<Link to="/">
						<Button variant="ghost" size="icon" data-testid="button-back">
							<ArrowRight className="h-5 w-5" />
						</Button>
					</Link>
					<h1
						className="flex-1 text-center text-lg font-bold"
						data-testid="text-categories-title"
					>
						التصنيفات
					</h1>
					<div className="w-10" />
				</div>
			</header>

			<div className="p-4">
				<div className="grid grid-cols-2 gap-4">
					{categories.map((category) => (
						<Link key={category.id} to={`/category/${category.id}`}>
							<CategoryCard category={category} />
						</Link>
					))}
				</div>
			</div>

			<BottomNav />
		</div>
	);
}
