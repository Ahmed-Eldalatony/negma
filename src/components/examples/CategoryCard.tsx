import CategoryCard from '../CategoryCard';
import { useCategory } from '@/hooks/useCategory';
import { Spinner } from '@/components/ui/spinner';

export default function CategoryCardExample() {
	const { categories, loading, error } = useCategory();

	if (loading)
		return (
			<div className="flex items-center justify-center p-8">
				<Spinner size="lg" />
			</div>
		);
	if (error) return <div>Error: {error}</div>;
	if (!categories) return <div>No categories available</div>;

	return (
		<div className="flex gap-3 p-4 overflow-x-auto max-w-mobile mx-auto">
			{categories
				.map((cat) => ({ id: cat.id.toString(), name: cat.name, image: cat.image }))
				.map((category) => (
					<CategoryCard key={category.id} category={category} />
				))}
		</div>
	);
}
