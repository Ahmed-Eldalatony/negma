import { Link } from 'react-router';
import type { Category } from '@/shared/mock-data';

interface CategoryCardProps {
	category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
	return (
		<Link to={`/category/${category.id}`}>
			<div className="w-full flex-shrink-0" data-testid={`card-category-${category.id}`}>
				<div className="bg-muted mb-2 aspect-square overflow-hidden rounded-md">
					<img
						src={category.image}
						alt={category.nameAr}
						className="h-full w-full object-cover"
						data-testid={`img-category-${category.id}`}
					/>
				</div>
				<p
					className="text-center text-xs leading-tight font-medium"
					data-testid={`text-category-name-${category.id}`}
				>
					{category.nameAr}
				</p>
			</div>
		</Link>
	);
}
