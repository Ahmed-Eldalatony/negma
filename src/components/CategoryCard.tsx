import { cn } from '@/lib/utils';
import type { Category } from '@/shared/mock-data';

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export default function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <div className={cn(className)}>
      <div className="w-full flex- dkmshrink-0" data-testid={`card-category-${category.id}`}>
        <div className="bg-muted mb-2 aspect-square overflow-hidden rounded-md">
          <img
            src={category.image}
            alt={category.name}
            className="h-full w-full object-cover"
            data-testid={`img-category-${category.id}`}
          />
        </div>
        <p
          className="text-center text-xs leading-tight font-medium"
          data-testid={`text-category-name-${category.id}`}
        >
          {category.name}
        </p>
      </div>
    </div>
  );
}
