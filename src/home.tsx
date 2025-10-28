import { useEffect, useState } from 'react';
import { Menu, Rocket, Asterisk } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import HeroBanner from '@/components/HeroBanner';
import CategoryCard from '@/components/CategoryCard';
import CategoryCardSkeleton from '@/components/CategoryCardSkeleton';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import BottomNav from '@/components/BottomNav';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import SearchFilter from '@/components/SearchFilter';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useProductsStore } from './store';
import { useStore } from '@/hooks/useStoreData';
import { useCategory } from '@/hooks/useCategory';
// TODO: look for how to use metdata of the fetched data
export function meta() {
	return [
		{ title: 'نجمة - الرئيسية' },
		{ name: 'description', content: 'تسوق المنتجات والتصنيفات في نجمة' },
	];
}

export default function Home() {
	const navigate = useNavigate();
	const { storedData, error: storeError } = useStore();
	const { categories, loading: categoriesLoading, error: categoriesError } = useCategory();
	const { products, isLoading: productsLoading, fetchProducts } = useProductsStore();

	// Search and filter state
	const [searchText, setSearchText] = useState('');
	const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

	// Handle search navigation
	const handleSearch = () => {
		const params = new URLSearchParams();
		if (searchText) params.set('query', searchText);
		if (selectedCategoryId && selectedCategoryId !== 'all')
			params.set('category', selectedCategoryId);
		navigate(`/search?${params.toString()}`);
	};

	// Add state to track if data has been fetched to prevent infinite loops
	const [hasFetched, setHasFetched] = useState({
		products: false,
	});

	useEffect(() => {
		if (!products && !productsLoading && !hasFetched.products) {
			fetchProducts().then(() => {
				setHasFetched((prev) => ({ ...prev, products: true }));
			});
		}
	}, [products, productsLoading, fetchProducts, hasFetched.products]);

	// Reset the fetched state when navigating to allow refetching
	useEffect(() => {
		return () => {
			setHasFetched({ products: false });
		};
	}, []);

	if (storeError) {
		console.error('Error loading store data:', storeError);
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
			<header className="bg-background sticky top-0 z-40 border-b py-3 px-4">
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
									<Link to="/categories" className="hover:text-primary text-lg font-medium">
										التصنيفات
									</Link>
									<Link to="/products" className="hover:text-primary text-lg font-medium">
										المنتجات
									</Link>
								</div>
							</SheetContent>
						</Sheet>
						<ThemeSwitcher />
					</div>
					<div className="flex items-center gap-2">
						<span className="text-xl font-bold" data-testid="text-logo">
							{storedData?.settings.name || 'نجمة'}
						</span>
						{storedData?.logo ? (
							<img src={storedData.logo} alt="Logo" className="h-12 w-12" />
						) : (
							<Asterisk className="h-6 w-6" />
						)}
					</div>
				</div>
				{/* Search and filter bar */}
				<div className="bg-background py-2">
					<SearchFilter
						searchText={searchText}
						onSearchTextChange={setSearchText}
						selectedCategoryId={selectedCategoryId}
						onCategoryChange={setSelectedCategoryId}
						categories={categories}
						onSearch={handleSearch}
					/>
				</div>
			</header>

			<HeroBanner />

			<div className="space-y-6 py-4 ">
				<section className="min-w-28 max-w-[100vw]">
					<h2 className="mb-3 text-lg font-bold" data-testid="text-categories-title">
						التصنيفات
					</h2>
					<ScrollArea className="">
						<div className="flex gap-3 pb-4 ">
							{categoriesLoading ? (
								Array.from({ length: 6 }).map((_, i) => (
									<CategoryCardSkeleton key={i} className={'min-w-28'} />
								))
							) : categoriesError ? (
								<div className="py-4 text-center text-red-500">Error loading categories</div>
							) : Array.isArray(categories) ? (
								categories
									.map((cat) => ({ ...cat, id: cat.id.toString() }))
									.map((category) => (
										<Link key={category.id} to={`/category/${category.id}`}>
											<CategoryCard className={'min-w-28'} category={category} />
										</Link>
									))
							) : (
								<div className="py-4 text-center">No categories available</div>
							)}
						</div>
						<ScrollBar orientation="horizontal" className="h-3" />
					</ScrollArea>
				</section>

				<section>
					<h2 className="mb-3 text-lg font-bold" data-testid="text-products-title">
						المنتجات
					</h2>
					<div className="grid grid-cols-2 px-4 gap-3">
						{productsLoading ? (
							Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
						) : products ? (
							products
								.slice(0, 4)
								.map((p) => ({
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
								.map((product) => <ProductCard key={product.id} product={product} />)
						) : (
							<div className="col-span-2 py-4 text-center">No products available</div>
						)}
					</div>
				</section>
			</div>

			<BottomNav />
		</div>
	);
}
