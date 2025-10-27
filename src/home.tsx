import { useEffect } from 'react';
import { Menu, Rocket, Asterisk } from 'lucide-react';
import { Link } from 'react-router';
import HeroBanner from '@/components/HeroBanner';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useStoreDataStore, useCategoriesStore, useProductsStore } from './store';
import { categories as mockCategories, products as mockProducts } from '@/shared/mock-data'; // fallback to mock data

export function meta({}: any) {
	return [
		{ title: 'نجمة - الرئيسية' },
		{ name: 'description', content: 'تسوق المنتجات والتصنيفات في نجمة' },
	];
}

export default function Home() {
	const { storedData, isLoading, error, fetchStoreData } = useStoreDataStore();
	const { categories, isLoading: categoriesLoading, fetchCategories } = useCategoriesStore();
	const { products, isLoading: productsLoading, fetchProducts } = useProductsStore();

	useEffect(() => {
		if (!storedData && !isLoading) {
			fetchStoreData();
		}
	}, [storedData, isLoading, fetchStoreData]);

	useEffect(() => {
		if (!categories && !categoriesLoading) {
			fetchCategories();
		}
	}, [categories, categoriesLoading, fetchCategories]);

	useEffect(() => {
		if (!products && !productsLoading) {
			fetchProducts();
		}
	}, [products, productsLoading, fetchProducts]);

	useEffect(() => {
		if (storedData) {
			document.title = `${storedData?.settings.name} - الرئيسية`;
		}
	}, [storedData]);

	if (isLoading) {
		return <div className="flex h-screen items-center justify-center">جاري التحميل...</div>;
	}

	if (error) {
		console.error('Error loading store data:', error);
		// Fallback to mock data if there's an error
		console.log('Using mock data due to error');
	}

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
						{storedData?.logo ? (
							<img src={storedData.logo} alt="Logo" className="h-8 w-8" />
						) : (
							<Asterisk className="h-6 w-6" />
						)}
						<span className="text-xl font-bold" data-testid="text-logo">
							{storedData?.settings.name || 'نجمة'}
						</span>
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
						{(categories
							? categories.map((cat) => ({ ...cat, id: cat.id.toString() }))
							: mockCategories
						).map((category) => (
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
						{(products
							? products.slice(0, 4).map((p) => ({
									id: p.id.toString(),
									name: p.name,
									nameAr: p.name,
									image: p.media[0]?.url || '',
									price: parseFloat(p.prices[0]?.price_in_usd || '0'),
									originalPrice: undefined,
									discount: undefined,
									category: '',
									categoryAr: '',
									inStock: p.inventory > 0,
									stockCount: p.inventory,
									rating: undefined,
									reviewCount: undefined,
									description: p.description,
									descriptionAr: p.description,
									colors: undefined,
									offers: undefined,
								}))
							: mockProducts.slice(0, 4)
						).map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</section>
			</div>

			<BottomNav />
		</div>
	);
}
