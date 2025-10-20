import { Link } from "react-router";
import type { Category } from "@/shared/mock-data";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link to={`/category/${category.id}`}>
      <div 
        className="flex-shrink-0 w-28"
        data-testid={`card-category-${category.id}`}
      >
        <div className="aspect-square bg-muted rounded-md overflow-hidden mb-2">
          <img
            src={category.image}
            alt={category.nameAr}
            className="w-full h-full object-cover"
            data-testid={`img-category-${category.id}`}
          />
        </div>
        <p 
          className="text-xs font-medium text-center leading-tight"
          data-testid={`text-category-name-${category.id}`}
        >
          {category.nameAr}
        </p>
      </div>
    </Link>
  );
}
