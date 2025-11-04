import ProductCard from '../ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Spinner } from '@/components/ui/spinner';

export default function ProductCardExample() {
	const { data: products, isLoading, error } = useProducts();

	if (isLoading)
		return (
			<div className="flex items-center justify-center p-8">
				<Spinner size="lg" />
			</div>
		);
	if (error) return <div>Error: {error.message}</div>;
	if (!products) return <div>No products available</div>;

	return (
		<div className="grid grid-cols-2 gap-3 p-4 max-w-mobile mx-auto">
			{products
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
				.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
		</div>
	);
}
