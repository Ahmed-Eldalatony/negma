import { Minus, Plus, Trash2, ArrowRight, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router';
import { useCartStore } from '@/store';
import { products, Product } from '@/shared/mock-data';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';

export default function CartPage() {
	const { cart, updateQuantity, removeFromCart, getCartTotal } = useCartStore();

	const cartItems: (Product & { quantity: number })[] = cart
		.map((item) => {
			const product = products.find((p) => p.id === item.id);
			return product ? { ...product, quantity: item.quantity } : null;
		})
		.filter((item): item is Product & { quantity: number } => item !== null);

	const total = getCartTotal();

	if (cartItems.length === 0) {
		return (
			<div className="min-h-screen min-w-full pb-20">
				<header className="bg-background sticky top-0 z-40 border-b p-4">
					<div className="flex items-center justify-between">
						<Link to="/">
							<Button variant="ghost" size="icon" data-testid="button-back">
								<ArrowRight className="h-5 w-5" />
							</Button>
						</Link>
						<h1
							className="flex-1 text-center text-lg font-bold"
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
					<p className="text-muted-foreground mb-6">
						لم تقم بإضافة أي منتجات إلى السلة بعد
					</p>
					<Link to="/">
						<Button data-testid="button-shop">ابدأ التسوق</Button>
					</Link>
				</div>

				<BottomNav />
			</div>
		);
	}

	return (
		<div className="min-h-screen pb-20">
			<header className="bg-background sticky top-0 z-40 border-b p-4">
				<div className="flex items-center justify-between">
					<Link to="/">
						<Button variant="ghost" size="icon" data-testid="button-back">
							<ArrowRight className="h-5 w-5" />
						</Button>
					</Link>
					<h1
						className="flex-1 text-center text-lg font-bold"
						data-testid="text-cart-title"
					>
						السلة ({cartItems.length})
					</h1>
					<div className="w-10" />
				</div>
			</header>

			<div className="space-y-4 p-4">
				{cartItems.map((item) => (
					<div key={item.id} className="bg-muted rounded-lg p-4">
						<div className="flex gap-4">
							<img
								src={item.image}
								alt={item.nameAr}
								className="h-20 w-20 rounded-md object-cover"
							/>
							<div className="flex-1">
								<h3 className="mb-1 text-sm font-medium">{item.nameAr}</h3>
								<p className="text-primary font-bold">{item.price} ريال</p>
								<div className="mt-2 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											size="icon"
											className="h-8 w-8"
											onClick={() =>
												updateQuantity(item.id, item.quantity - 1)
											}
											disabled={item.quantity <= 1}
										>
											<Minus className="h-4 w-4" />
										</Button>
										<span className="w-8 text-center">{item.quantity}</span>
										<Button
											variant="outline"
											size="icon"
											className="h-8 w-8"
											onClick={() =>
												updateQuantity(item.id, item.quantity + 1)
											}
										>
											<Plus className="h-4 w-4" />
										</Button>
									</div>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => removeFromCart(item.id)}
										className="text-destructive hover:text-destructive"
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
						<span className="text-primary text-lg font-bold">
							{total.toFixed(2)} ريال
						</span>
					</div>
					<div className="text-muted-foreground text-xs">
						الشحن مجاني على الطلبات فوق 50 ريال
					</div>
				</div>

				<div className="space-y-2">
					<Button className="h-12 w-full font-bold" data-testid="button-checkout">
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
