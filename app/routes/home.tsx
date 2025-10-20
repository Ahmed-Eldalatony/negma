import type { Route } from "./+types/home";
import { Menu, Rocket, Asterisk } from "lucide-react";
import { Link } from "react-router";
import HeroBanner from "~/components/HeroBanner";
import CategoryCard from "~/components/CategoryCard";
import ProductCard from "~/components/ProductCard";
import BottomNav from "~/components/BottomNav";
import { ThemeSwitcher } from "~/components/ThemeSwitcher";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { categories, products } from "~/shared/mock-data";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "نجمة - الرئيسية" },
    { name: "description", content: "تسوق المنتجات والتصنيفات في نجمة" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Top Banner */}
      <div className="sticky top-0 bg-primary text-primary-foreground z-50 py-3 px-4">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <Rocket className="h-4 w-4" />
          <span data-testid="text-banner-promo">
            شحن مجاني على الطلبات التي تزيد عن 50$
          </span>
        </div>
      </div>

      {/* Header with Logo */}
      <header className="sticky top-[52px] bg-background z-40 px-4 py-3 border-b ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 mt-6">
                  <Link
                    to="/"
                    className="text-lg font-medium hover:text-primary"
                  >
                    الرئيسية
                  </Link>
                  <Link
                    to="/categories"
                    className="text-lg font-medium hover:text-primary"
                  >
                    التصنيفات
                  </Link>
                  <Link
                    to="/products"
                    className="text-lg font-medium hover:text-primary"
                  >
                    المنتجات
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
            <ThemeSwitcher />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold" data-testid="text-logo">
              نجمة
            </span>
            <Asterisk className="h-6 w-6" />
          </div>
        </div>
      </header>

      <HeroBanner />

      <div className="p-4 space-y-6">
        <section>
          <h2
            className="text-lg font-bold mb-3"
            data-testid="text-categories-title"
          >
            التصنيفات
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        <section>
          <h2
            className="text-lg font-bold mb-3"
            data-testid="text-products-title"
          >
            المنتجات
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
