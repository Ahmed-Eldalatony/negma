// Search results page component
// Handles routes like /search?query=text&category=id

import { ArrowRight, Search as SearchIcon } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import BottomNav from '@/components/BottomNav';
import SearchFilter from '@/components/SearchFilter';
import { Button } from '@/components/ui/button';
import { useProductsStore } from '@/store';
import { useCategory } from '@/hooks/useCategory';
import { useEffect, useState } from 'react';
import type { Product } from '@/shared/mock-data';

// Meta function for SEO
export function meta() {
	return [
		{ title: 'البحث - نجمة' },
		{ name: 'description', content: 'نتائج البحث في منتجات نجمة' },
	];
}

export default function SearchPage() {
	const [searchParams, setSearchParams] = useSearchParams();

	// Get search parameters from URL
	const initialQuery = searchParams.get('query') || '';
	const initialCategory = searchParams.get('category') || 'all';

	// Local state for search and filter
	const [searchText, setSearchText] = useState(initialQuery);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCategory);

	// Fetch data
	const { categories } = useCategory();
	const {
		filteredProducts,
		isLoading: productsLoading,
		fetchProductsWithFilters,
	} = useProductsStore();

	// Update URL when search/filter changes
	const updateSearchParams = (query: string, category: string) => {
		const params = new URLSearchParams();
		if (query) params.set('query', query);
		if (category && category !== 'all') params.set('category', category);
		setSearchParams(params);
	};

	// Handle search input
	const handleSearch = () => {
		updateSearchParams(searchText, selectedCategoryId);
		const categoryId = selectedCategoryId === 'all' ? undefined : selectedCategoryId;
		fetchProductsWithFilters(categoryId, searchText || undefined);
	};

	// Fetch products when component mounts or URL params change
	useEffect(() => {
		const categoryId = initialCategory === 'all' ? undefined : initialCategory;
		fetchProductsWithFilters(categoryId, initialQuery || undefined);
	}, [initialQuery, initialCategory, fetchProductsWithFilters]);

	// Transform products data to match ProductCard component props
	const transformedProducts: Product[] = filteredProducts
		? filteredProducts.map((p) => ({
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
		: [];

	return (
		<div className="bg-background min-h-screen pb-20">
			{/* Header with back button and search */}
			<header className="bg-background sticky top-0 z-40 border-b px-4 py-3">
				<div className="flex items-center gap-3">
					<Link to="/">
						<Button variant="ghost" size="icon" data-testid="button-back">
							<ArrowRight className="h-5 w-5" />
						</Button>
					</Link>
					<div className="flex-1">
						<SearchFilter
							searchText={searchText}
							onSearchTextChange={setSearchText}
							selectedCategoryId={selectedCategoryId}
							onCategoryChange={setSelectedCategoryId}
							categories={categories}
							onSearch={handleSearch}
						/>
					</div>
				</div>
			</header>

			{/* Search results */}
			<div className="p-4">
				{/* Results header */}
				<div className="mb-4">
					<h1 className="text-lg font-bold mb-1">
						نتائج البحث {searchText && `لـ "${searchText}"`}
					</h1>
					<p className="text-sm text-muted-foreground">
						{transformedProducts.length} منتج{transformedProducts.length !== 1 ? '' : ''} gefunden
					</p>
				</div>

				{/* Products grid */}
				{productsLoading ? (
					<div className="grid grid-cols-2 gap-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<ProductCardSkeleton key={i} />
						))}
					</div>
				) : transformedProducts.length === 0 ? (
					<div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
						<SearchIcon className="text-muted-foreground mb-4 h-16 w-16" />
						<h2 className="mb-2 text-xl font-semibold">لا توجد نتائج</h2>
						<p className="text-muted-foreground mb-6">لم نتمكن من العثور على منتجات تطابق بحثك</p>
						<Link to="/">
							<Button>العودة للرئيسية</Button>
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-2 gap-3">
						{transformedProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				)}
			</div>

			<BottomNav />
		</div>
	);
}
