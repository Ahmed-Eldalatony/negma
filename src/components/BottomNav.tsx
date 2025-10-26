import { Home, Grid3x3, ShoppingCart, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useCartStore } from '@/store';
import { Badge } from '@/components/ui/badge';

const navItems = [
	{ id: 'home', path: '/', icon: Home, labelAr: 'الرئيسية' },
	{ id: 'categories', path: '/categories', icon: Grid3x3, labelAr: 'التصنيفات' },
	{ id: 'cart', path: '/cart', icon: ShoppingCart, labelAr: 'السلة' },
	{ id: 'favorites', path: '/favorites', icon: Heart, labelAr: 'المفضلة' },
];

export default function BottomNav() {
	const location = useLocation();
	const { getCartItemCount } = useCartStore();
	const cartCount = getCartItemCount();

	return (
		<nav
			className="bg-background fixed right-0 bottom-0 left-0 z-50 border-t"
			data-testid="bottom-nav"
		>
			<div className="mx-auto flex h-16 max-w-md items-center justify-around">
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = location.pathname === item.path;

					return (
						<Link key={item.id} to={item.path} data-testid={`link-nav-${item.id}`}>
							<div className="relative flex min-w-[60px] flex-col items-center gap-1 px-3 py-2">
								<div className="relative">
									<Icon
										className={`h-5 w-5 ${isActive ? 'fill-current' : ''}`}
										strokeWidth={isActive ? 2.5 : 2}
									/>
									{item.id === 'cart' && cartCount > 0 && (
										<Badge
											variant="destructive"
											className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center p-0 text-xs"
										>
											{cartCount}
										</Badge>
									)}
								</div>
								<span
									className={`text-xs ${isActive ? 'font-bold' : 'font-normal'}`}
								>
									{item.labelAr}
								</span>
							</div>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
