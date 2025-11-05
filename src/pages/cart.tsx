import { Minus, Plus, Trash2, ArrowRight, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useCartStore } from '@/store';
import { useProducts } from '@/hooks/useProducts';
import { useCurrency } from '@/hooks/useCurrency';
import { convertPrice, formatPrice } from '@/lib/utils';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';

export default function CartPage() {
	const navigate = useNavigate();
	const { cart, updateQuantity, removeFromCart } = useCartStore();
	const { data: products, isLoading } = useProducts();
	const { currency } = useCurrency();

	const cartItems = cart
		.map((item) => {
			const product = products?.find((p) => p.id.toString() === item.id);
			if (!product) return null;
			const usdPrice = parseFloat(product.prices[0]?.price_in_usd || '0');
			const convertedPrice = currency ? convertPrice(usdPrice, currency.rate_to_usd) : usdPrice;
			return {
				id: item.id,
				quantity: item.quantity,
				name: product.name,
				image: product.media[0]?.url || '',
				price: usdPrice,
				convertedPrice,
			};
		})
		.filter((item) => item !== null);

	const total = cartItems.reduce((sum, item) => sum + item.convertedPrice * item.quantity, 0);

	if (isLoading) {
		return (
			<div className="min-h-screen  w-sm pb-20">
				<header className="bg-background sticky top-0 z-40 border-b p-4">
					<div className="flex items-center justify-between">
						<Link to="/">
							<Button variant="ghost" size="icon" data-testid="button-back">
								<ArrowRight className="h-5 w-5" />
							</Button>
						</Link>
						<h1 className="flex-1 text-center text-lg font-bold" data-testid="text-cart-title">
							السلة
						</h1>
						<div className="w-10" />
					</div>
				</header>
				<div className="flex h-screen items-center justify-center">جاري التحميل...</div>
			</div>
		);
	}

	if (cartItems.length === 0) {
		return (
			<div className="min-h-screen w-sm  pb-20">
				<header className="bg-background w-full sticky top-0 z-40 border-b p-4">
					<div className="flex items-center justify-between">
						<Link to="/">
							<Button variant="ghost" size="icon" data-testid="button-back">
								<ArrowRight className="h-5 w-5" />
							</Button>
						</Link>
						<h1
							className="flex-1 text-center  text-center  text-lg font-bold"
							data-testid="text-cart-title"
						>
							السلة
						</h1>
						<div className="w-10" />
					</div>
				</header>

				<div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
					<div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
						<ShoppingCart className="text-muted-foreground h-8 w-8" />
					</div>
					<h2 className="mb-2 text-xl font-semibold">السلة فارغة</h2>
					<p className="text-muted-foreground mb-6">لم تقم بإضافة أي منتجات إلى السلة بعد</p>
					<Link to="/">
						<Button data-testid="button-shop">ابدأ التسوق</Button>
					</Link>
				</div>

				<BottomNav />
			</div>
		);
	}

	return (
		<div className="min-h-screen  w-sm pb-20">
			<header className="bg-background sticky top-0 z-40 border-b p-2">
				<div className="flex items-center justify-between">
					<Link to="/">
						<Button variant="ghost" size="icon" data-testid="button-back">
							<ArrowRight className="h-5 w-5" />
						</Button>
					</Link>
					<h1 className="flex-1 text-center text-lg font-bold" data-testid="text-cart-title">
						السلة ({cartItems.length})
					</h1>
					<div className="w-10" />
				</div>
			</header>

			<div className="space-y-4 p-2">
				{cartItems.map((item) => (
					<div key={item.id} className="bg-muted rounded-lg p-2">
						<div className="flex gap-4">
							<img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
							<div className=" w-full flex  flex-wrap justify-between">
								<h3 className="mb-1 text-start text-sm font-medium">{item.name}</h3>
								<p className="text-black text-start font-bold">
									{currency
										? formatPrice(item.convertedPrice, currency.currency)
										: `${item.price} ريال`}
								</p>
								<div className="mt-2 w-full flex items-center justify-between">
									<div className="flex  items-center gap-2">
										<Button
											variant="outline"
											size="icon"
											className="h-6 w-6  rounded-full"
											onClick={() => updateQuantity(item.id, item.quantity - 1)}
											disabled={item.quantity <= 1}
										>
											<Minus className="h-4 w-4" />
										</Button>
										<span className="w-8 text-center">{item.quantity}</span>
										<Button
											variant="outline"
											size="icon"
											className="h-6 w-6 rounded-full"
											onClick={() => updateQuantity(item.id, item.quantity + 1)}
										>
											<Plus className="h-4 w-4" />
										</Button>
									</div>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => removeFromCart(item.id)}
										className="text-destructive hover:text-destructive mr-auto"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>
					</div>
				))}

				<div className="bg-muted rounded-lg p-4">
					<div className="mb-2 flex items-center justify-between">
						<span className="font-medium">المجموع الكلي:</span>
						<span className="text-black text-lg font-bold">
							{currency ? formatPrice(total, currency.currency) : `${total.toFixed(2)} ريال`}
						</span>
					</div>
					{/* <div className="text-muted-foreground text-xs">الشحن مجاني على الطلبات فوق 50 ريال</div> */}
				</div>

				<div className="space-y-2">
					<Button
						className="h-12 w-full font-bold"
						data-testid="button-checkout"
						onClick={() => navigate('/checkout')}
					>
						إتمام الطلب
					</Button>
					<Link to="/">
						<Button
							variant="outline"
							className="h-12 w-full"
							data-testid="button-continue-shopping"
						>
							متابعة التسوق
						</Button>
					</Link>
				</div>
			</div>

			<BottomNav />
		</div>
	);
}
