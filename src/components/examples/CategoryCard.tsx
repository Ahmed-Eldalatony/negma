import CategoryCard from '../CategoryCard';
import { categories } from '@/shared/mock-data';

export default function CategoryCardExample() {
  return (
    <div className="flex gap-3 p-4 overflow-x-auto max-w-mobile mx-auto">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
