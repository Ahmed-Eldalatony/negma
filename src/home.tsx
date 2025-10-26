import { Menu, Rocket, Asterisk } from 'lucide-react';
import { Link } from 'react-router';
import HeroBanner from '@/components/HeroBanner';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { categories, products } from '@/shared/mock-data';

export function meta({}: any) {
	return [
		{ title: 'نجمة - الرئيسية' },
		{ name: 'description', content: 'تسوق المنتجات والتصنيفات في نجمة' },
	];
}

export default function Home() {
	return (
		<div className="mb-20 min-h-screen">
			{/* Top Banner */}
			<div className="bg-primary text-primary-foreground sticky top-0 z-50 px-4 py-3">
				<div className="flex items-center justify-center gap-2 text-sm font-medium">
					<Rocket className="h-4 w-4" />
					<span data-testid="text-banner-promo bg-black">
						شحن مجاني على الطلبات التي تزيد عن 50$
					</span>
				</div>
			</div>

			{/* Header with Logo */}
			<header className="bg-background sticky top-0 z-40 border-b px-4 py-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" data-testid="button-menu">
									<Menu className="h-6 w-6" />
								</Button>
							</SheetTrigger>
							<SheetContent side="right">
								<div className="mt-6 flex flex-col gap-4">
									<Link to="/" className="hover:text-primary text-lg font-medium">
										الرئيسية
									</Link>
									<Link
										to="/categories"
										className="hover:text-primary text-lg font-medium"
									>
										التصنيفات
									</Link>
									<Link
										to="/products"
										className="hover:text-primary text-lg font-medium"
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

			<div className="space-y-6 p-4">
				<section>
					<h2 className="mb-3 text-lg font-bold" data-testid="text-categories-title">
						التصنيفات
					</h2>
					<div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
						{categories.map((category) => (
							<CategoryCard
								className={'min-w-28'}
								key={category.id}
								category={category}
							/>
						))}
					</div>
				</section>

				<section>
					<h2 className="mb-3 text-lg font-bold" data-testid="text-products-title">
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
