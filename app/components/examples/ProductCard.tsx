import ProductCard from '../ProductCard';
import { products } from '~/shared/mock-data';

export default function ProductCardExample() {
  return (
    <div className="grid grid-cols-2 gap-3 p-4 max-w-mobile mx-auto">
      {products.slice(0, 4).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
