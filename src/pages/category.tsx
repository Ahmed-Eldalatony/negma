import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { Link, useParams } from "react-router";
import ProductCard from "@/components/ProductCard";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { categories, products } from "@/shared/mock-data";

export function meta({ params }:any) {
  const category = categories.find(c => c.id === params.id);
  return [
    { title: `${category?.nameAr || 'تصنيف'} - نجمة` },
    { name: "description", content: `تصفح منتجات ${category?.nameAr || 'التصنيف'}` },
  ];
}

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id || "1";
  
  const category = categories.find(c => c.id === categoryId);
  const categoryProducts = products.filter(p => p.category === categoryId);

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 bg-background border-b  z-40 p-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold flex-1 text-center" data-testid="text-category-title">
            {category?.nameAr || 'فواكه وخضروات'}
          </h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => console.log('Filter clicked')}
            data-testid="button-filter"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
