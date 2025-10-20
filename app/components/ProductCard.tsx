import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import type { Product } from "~/shared/mock-data";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`}>
      <div
        className="relative group border rounded-md h-[280px] border-gray-300  overflow-hidden"
        data-testid={`card-product-${product.id}`}
      >
        <div className=" relattive aspect-square bg-muted overflow-hidden mb-2">
          {product.discount && (
            <Badge
              variant="destructive"
              className="!absolute   top-2 right-2 z-10 text-xs font-bold"
              data-testid={`badge-discount-${product.id}`}
            >
              {product.discount}% خصم
            </Badge>
          )}
          <img
            src={product.image}
            alt={product.nameAr}
            className="w-full h-full  object-cover"
            data-testid={`img-product-${product.id}`}
          />
        </div>

        <div className="space-y-1 pr-2">
          <h3
            className="font-medium text-sm line-clamp-2 leading-tight"
            data-testid={`text-name-${product.id}`}
          >
            {product.nameAr}
          </h3>

          <div className="flex items-center gap-2">
            {product.originalPrice && (
              <span
                className="text-xs text-muted-foreground line-through"
                data-testid={`text-original-price-${product.id}`}
              >
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span
              className="text-base font-bold"
              data-testid={`text-price-${product.id}`}
            >
              ${product.price.toFixed(2)}
            </span>
          </div>

          {!product.inStock && (
            <p
              className="text-xs text-destructive"
              data-testid={`text-stock-${product.id}`}
            >
              نفذت الكمية
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
