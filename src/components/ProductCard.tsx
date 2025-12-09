import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';

import type { Product } from '@/shared/mock-data';

import { useCurrency } from '@/hooks/useCurrency';
import { convertPrice, formatPrice } from '@/lib/utils';

interface ProductCardProps {
	product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
	const { currency } = useCurrency();

	const convertedPrice = currency
		? convertPrice(product.price, currency.rate_to_usd)
		: product.price;
	const convertedOriginalPrice =
		product.originalPrice && currency
			? convertPrice(product.originalPrice, currency.rate_to_usd)
			: product.originalPrice;

	const priceDisplay = currency
		? formatPrice(convertedPrice, currency.currency)
		: `$${product.price.toFixed(2)}`;
	const originalPriceDisplay =
		convertedOriginalPrice && currency
			? formatPrice(convertedOriginalPrice, currency.currency)
			: product.originalPrice
				? `$${product.originalPrice.toFixed(2)}`
				: null;

	return (
		<Link to={`/product/${product.id}`}>
			<div
				className="group relative h-[280px] h-fit pb-2 overflow-hidden rounded-md border border-gray-300"
				data-testid={`card-product-${product.id}`}
			>
				<div className="relattive bg-muted mb-2 aspect-square overflow-hidden">
					{product.discount && (
						<Badge
							variant="destructive"
							className="!absolute top-2 right-2 z-10 text-xs font-bold"
							data-testid={`badge-discount-${product.id}`}
						>
							{product.discount}% خصم
						</Badge>
					)}

					<img
						src={product.image}
						alt={product.nameAr}
						className="h-full w-full object-cover"
						data-testid={`img-product-${product.id}`}
					/>
				</div>

				<div className="space-y-1 pr-2">
					<h3
						className="line-clamp-2 text-start text-sm leading-tight font-medium"
						data-testid={`text-name-${product.id}`}
					>
						{product.nameAr}
					</h3>

					<div className="flex items-center gap-2">
						{originalPriceDisplay && (
							<span
								className="text-muted-foreground text-xs line-through"
								data-testid={`text-original-price-${product.id}`}
							>
								{originalPriceDisplay}
							</span>
						)}
						<span className="text-base font-bold" data-testid={`text-price-${product.id}`}>
							{priceDisplay}
						</span>
					</div>

					{!product.inStock && (
						<p className="text-destructive text-xs" data-testid={`text-stock-${product.id}`}>
							نفذت الكمية
						</p>
					)}
				</div>
			</div>
		</Link>
	);
}
