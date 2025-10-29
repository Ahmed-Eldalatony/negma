import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
	Star,
	Check,
	Truck,
	Shield,
	Users,
	Zap,
	ChevronDown,
	MessageCircle,
	User,
	Phone,
	MapPin,
	Heart,
	ShoppingCart,
} from 'lucide-react';
import ProductImageGallery from '@/components/ProductImageGallery';
import ColorSelector from '@/components/ColorSelector';
import OfferCard from '@/components/OfferCard';
import CountdownTimer from '@/components/CountdownTimer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { useFavoritesStore, useCartStore, useProductsStore } from '@/store';
// TODO: get the right type instead of any
export function meta() {
	return [{ title: 'منتج - نجمة' }, { name: 'description', content: 'تفاصيل المنتج' }];
}

export default function ProductPage() {
	const params = useParams();
	const productId = params.id || '1';

	const { currentProduct, fetchProduct, isLoading } = useProductsStore();

	useEffect(() => {
		if (productId) {
			fetchProduct(productId);
		}
	}, [productId, fetchProduct]);

	const product = currentProduct
		? {
				id: currentProduct.id.toString(),
				name: currentProduct.name,
				nameAr: currentProduct.name,
				image: currentProduct.media[0]?.url || '',
				price: parseFloat(currentProduct.prices[0]?.price_in_usd || '0'),
				originalPrice: undefined as number | undefined,
				discount: undefined as number | undefined,
				category: '',
				categoryAr: '',
				inStock: currentProduct.inventory > 0,
				stockCount: currentProduct.inventory,
				rating: undefined as number | undefined,
				reviewCount: undefined as number | undefined,
				description: currentProduct.description,
				descriptionAr: currentProduct.description,
				colors: undefined as string[] | undefined,
				offers: undefined as
					| {
							id: string;
							title: string;
							titleAr: string;
							discount: number;
							originalPrice: number;
							newPrice: number;
							isLimited?: boolean;
							limitedCount?: number;
					  }[]
					| undefined,
			}
		: null;
	const [selectedOffer, setSelectedOffer] = useState('');
	const [selectedColor, setSelectedColor] = useState('');
	// const [quantity, setQuantity] = useState(1);

	// const increaseQuantity = () => setQuantity(prev => prev + 1);
	// const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

	const { toggleFavorite, isFavorite } = useFavoritesStore();
	const { addToCart, isInCart } = useCartStore();
	const [showCartDialog, setShowCartDialog] = useState(false);
	const [dialogMode, setDialogMode] = useState<'add' | 'development'>('add');

	if (isLoading || !product) {
		return (
			<div className="bg-background min-h-screen">
				<div className="space-y-3 p-4">
					<div className="relative">
						<Skeleton className="aspect-square w-full" />
					</div>
					<Skeleton className="h-6 w-3/4" />
					<Skeleton className="h-6 w-1/2" />
					<div className="grid grid-cols-4 gap-2">
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} className="aspect-square w-full" />
						))}
					</div>
					<Skeleton className="h-12 w-full" />
				</div>
			</div>
		);
	}

	// At this point, product is guaranteed to be not null
	const safeProduct = product!;
	const productImages = [safeProduct.image, safeProduct.image, safeProduct.image];

	const reviews = currentProduct?.reviews || [];

	const getTimeAgo = (dateString: string) => {
		const now = new Date();
		const reviewDate = new Date(dateString);
		const diffTime = Math.abs(now.getTime() - reviewDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 1) {
			return 'منذ يوم واحد';
		} else if (diffDays === 2) {
			return 'منذ يومين';
		} else if (diffDays >= 3 && diffDays <= 10) {
			return `منذ ${diffDays} أيام`;
		} else {
			return `منذ ${diffDays} يوم`;
		}
	};

	return (
		<div className="bg-background min-h-screen mb-40">
			<div className="space-y-3 p-4">
				<div className="relative">
					{safeProduct.rating && (
						<Badge
							className="bg-primary text-primary-foreground absolute top-3 right-3 z-10 flex items-center gap-1 text-sm font-bold"
							data-testid="badge-rating"
						>
							<Star className="h-3 w-3 fill-current" />
							{safeProduct.rating}
						</Badge>
					)}
					{safeProduct.discount && (
						<Badge
							variant="destructive"
							className="absolute top-3 left-3 z-10 text-sm font-bold"
							data-testid="badge-discount-main"
						>
							خصم {safeProduct.discount}%
						</Badge>
					)}
					<ProductImageGallery images={productImages} productName={safeProduct.nameAr} />
				</div>

				<div className="bg-muted rounded-md p-3">
					<div className="flex items-end justify-between">
						<div className="flex-1">
							<div className="text-muted-foreground mb-1 text-xs">
								{safeProduct.originalPrice && (
									<span className="line-through">{safeProduct.originalPrice.toFixed(0)} ريال</span>
								)}
							</div>
							<span className="block text-2xl font-bold" data-testid="text-main-price">
								{safeProduct.price} ريال
							</span>
							{safeProduct.originalPrice && (
								<div className="text-muted-foreground mt-1 text-xs">
									وفر {safeProduct.originalPrice - safeProduct.price} ريال (خصم{' '}
									{safeProduct.discount}%)
								</div>
							)}
						</div>
						<div className="text-right">
							<div className="text-muted-foreground text-xs">الحجم</div>
							<div className="text-sm font-medium">50 مل</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-4 gap-2 text-center">
					<div className="rounded-md border p-3">
						<Zap className="mx-auto mb-1 h-5 w-5" />
						<div className="text-[10px] font-medium">توصيل سريع</div>
					</div>
					<div className="rounded-md border p-3">
						<Users className="mx-auto mb-1 h-5 w-5" />
						<div className="text-[10px] font-medium">500+ طلب</div>
					</div>
					<div className="rounded-md border p-3">
						<Shield className="mx-auto mb-1 h-5 w-5" />
						<div className="text-[10px] font-medium">منتج أصلي</div>
					</div>
					<div className="rounded-md border p-3">
						<Truck className="mx-auto mb-1 h-5 w-5" />
						<div className="text-[10px] font-medium">توصيل مجاني</div>
					</div>
				</div>

				<div className="bg-muted space-y-2 rounded-md p-3">
					<div className="flex justify-between text-sm">
						<span className="font-medium">الكمية المتوفرة:</span>
						<span className="text-muted-foreground">محدودة</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="font-medium">بلد المنشأ:</span>
						<span className="text-muted-foreground">كوريا الجنوبية</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="font-medium">الماركة:</span>
						<span className="text-muted-foreground">سيترم من تاريخ الإنتاج</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="font-medium">وقت التوصيل:</span>
						<span className="text-muted-foreground">2-4 أيام عمل</span>
					</div>
				</div>

				<Button
					className="bg-primary hover:bg-primary/90 h-12 w-full text-sm font-bold"
					onClick={() => console.log('Order placed')}
					data-testid="button-order-main"
				>
					اطلب الآن - الدفع عند الاستلام
				</Button>

				<div className="bg-destructive/10 rounded-md p-2">
					<div className="mb-1 text-center">
						<span className="text-xs font-medium">ينتهي العرض خلال:</span>
					</div>
					<CountdownTimer />
				</div>

				{safeProduct.colors && (
					<ColorSelector
						colors={safeProduct.colors}
						selectedColor={selectedColor}
						onColorSelect={setSelectedColor}
					/>
				)}

				<div className="bg-muted flex items-center gap-2 rounded-md p-3">
					<MessageCircle className="h-4 w-4" />
					<span className="text-sm font-medium">لإجراء طلب، يرجى إدخال معلوماتك هنا:</span>
				</div>

				<div className="space-y-2">
					<div className="relative">
						<User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
						<input
							type="text"
							placeholder="الاسم الأول"
							className="bg-background border-input w-full rounded-md border px-3 py-2 pl-10 text-right text-sm"
							data-testid="input-first-name"
						/>
					</div>
					<div className="relative">
						<Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
						<input
							type="tel"
							placeholder="رقم الهاتف"
							className="bg-background border-input w-full rounded-md border px-3 py-2 pl-10 text-right text-sm"
							data-testid="input-phone"
						/>
					</div>
					<div className="relative">
						<MapPin className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
						<input
							type="text"
							placeholder="عنوان التوصيل"
							className="bg-background border-primary w-full rounded-md border-2 px-3 py-2 pl-10 text-right text-sm font-medium"
							data-testid="input-address"
						/>
					</div>
				</div>

				{safeProduct.offers && safeProduct.offers.length > 0 && (
					<div className="space-y-2">
						{safeProduct.offers.map((offer) => (
							<OfferCard
								key={offer.id}
								offer={offer}
								isSelected={selectedOffer === offer.id}
								onSelect={() => setSelectedOffer(offer.id)}
							/>
						))}
					</div>
				)}

				{safeProduct.descriptionAr && (
					<div className="space-y-2">
						<p
							className="text-muted-foreground text-sm leading-relaxed"
							data-testid="text-description"
						>
							{safeProduct.descriptionAr}
						</p>
					</div>
				)}

				<Accordion type="single" collapsible className="space-y-2">
					<AccordionItem value="payment" className="rounded-md border px-4">
						<AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
							<div className="flex items-center gap-2">
								<Shield className="h-4 w-4" />
								<span>سياسة الدفع عند الاستلام</span>
							</div>
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground pb-3 text-sm">
							الدفع عند وصول المنتج. الدفع عند وصول المنتج المنتج
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="guarantee" className="rounded-md border px-4">
						<AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
							<div className="flex items-center gap-2">
								<Check className="h-4 w-4" />
								<span>ضمان 30 يوماً</span>
							</div>
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground pb-3 text-sm">
							ضمان استرداد المال في حالة عدم الرضا عن المنتج
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="shipping" className="rounded-md border px-4">
						<AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
							<div className="flex items-center gap-2">
								<Truck className="h-4 w-4" />
								<span>الشحن</span>
							</div>
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground pb-3 text-sm">
							شحن مجاني على جميع الطلبات فوق 50$. التوصيل خلال 2-4 أيام عمل
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="return" className="rounded-md border px-4">
						<AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
							<div className="flex items-center gap-2">
								<ChevronDown className="h-4 w-4" />
								<span>سياسة الإرجاع</span>
							</div>
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground pb-3 text-sm">
							يمكنك إرجاع المنتج خلال 30 يوماً من تاريخ الاستلام
						</AccordionContent>
					</AccordionItem>
				</Accordion>

				<div className="bg-muted grid grid-cols-2 gap-3 rounded-md p-4">
					<div className="bg-background rounded-md p-3 text-center">
						<Zap className="mx-auto mb-2 h-6 w-6" />
						<div className="text-sm font-medium">شحن مجاني</div>
						<div className="text-muted-foreground text-xs">عند الشراء بأكثر من 99 دولار</div>
					</div>
					<div className="bg-background rounded-md p-3 text-center">
						<Shield className="mx-auto mb-2 h-6 w-6" />
						<div className="text-sm font-medium">إرجاع سهل</div>
						<div className="text-muted-foreground text-xs">تم تحديد سياسة الإرجاع إلى 60 يوماً</div>
					</div>
					<div className="bg-background rounded-md p-3 text-center">
						<Check className="mx-auto mb-2 h-6 w-6" />
						<div className="text-sm font-medium">الدفع عند الاستلام</div>
						<div className="text-muted-foreground text-xs">الدفع عند وصول المنتج</div>
					</div>
					<div className="bg-background rounded-md p-3 text-center">
						<Users className="mx-auto mb-2 h-6 w-6" />
						<div className="text-sm font-medium">دعم العملاء</div>
						<div className="text-muted-foreground text-xs">من الإثنين إلى السبت</div>
					</div>
				</div>

				<div className="space-y-3">
					<h3 className="text-lg font-bold">ماذا يقول عملاؤنا</h3>
					<div className="bg-muted rounded-md p-3 text-center">
						<Button
							variant="outline"
							className="w-full"
							onClick={() => console.log('Write review clicked')}
							data-testid="button-write-review"
						>
							اكتب مراجعتك
						</Button>
					</div>

					<div className="space-y-3">
						{reviews.map((review) => (
							<div
								key={review.id}
								className="rounded-md border p-4"
								data-testid={`review-${review.id}`}
							>
								<div className="mb-2  flex  justify-between">
									<div className=" text-start">
										<div className="flex items-center gap-2 ">
											<span className="font-medium">{review.customer_name}</span>
											<Check className="h-4 w-4 text-green-600" />
										</div>

										<span className="text-muted-foreground  text-xs">
											{getTimeAgo(review.created_at)}
										</span>
									</div>
									<div className="flex">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={`h-3 w-3 ${i < review.rating ? 'fill-red-500 text-red-500' : 'text-gray-300'}`}
											/>
										))}
									</div>
								</div>
								{review.title && (
									<h4 className="font-medium text-start text-sm mb-1">{review.title}</h4>
								)}
								<p className="text-muted-foreground text-start text-sm">{review.body}</p>
							</div>
						))}
					</div>

					<Button
						variant="outline"
						className="w-full"
						onClick={() => console.log('Show more reviews')}
						data-testid="button-more-reviews"
					>
						عرض المزيد
					</Button>
				</div>

				{/* Fixed Bottom Order Button */}
				<div className="bg-background fixed right-0 bottom-0 left-0 z-50 border-t p-3">
					<div className="mx-auto max-w-md space-y-2">
						<div className="flex gap-2">
							<Button
								variant="outline"
								className="h-11 flex-1 text-sm font-bold"
								onClick={() => toggleFavorite(safeProduct.id)}
								data-testid="button-favorite-fixed"
							>
								<Heart
									className={`mr-2 h-4 w-4 ${isFavorite(safeProduct.id) ? 'fill-red-500 text-red-500' : ''}`}
								/>
								{isFavorite(safeProduct.id) ? 'مفضل' : 'مفضلة'}
							</Button>
							<Button
								variant="outline"
								className="h-11 flex-1 text-sm font-bold"
								onClick={() => {
									addToCart(safeProduct.id);
									setDialogMode('add');
									setShowCartDialog(true);
								}}
								data-testid="button-cart-fixed"
							>
								<ShoppingCart className="mr-2 h-4 w-4" />
								{isInCart(safeProduct.id) ? 'في السلة' : 'سلة'}
							</Button>
						</div>
						<Button
							className="bg-primary hover:bg-primary/90 h-11 w-full text-sm font-bold"
							onClick={() => console.log('Order placed')}
							data-testid="button-order-fixed"
						>
							اطلب الآن - الدفع عند الاستلام
						</Button>

						<div className="grid grid-cols-3 gap-2 text-center text-xs">
							<div className="flex items-center justify-center gap-1">
								<Check className="text-destructive h-3 w-3" />
								<span>ضمان 30 يوماً</span>
							</div>
							<div className="flex items-center justify-center gap-1">
								<Truck className="h-3 w-3 text-yellow-600" />
								<span>شحن مجاني</span>
							</div>
							<div className="flex items-center justify-center gap-1">
								<Shield className="text-destructive h-3 w-3" />
								<span>الدفع عند الاستلام</span>
							</div>
						</div>
					</div>
				</div>

				<Dialog open={showCartDialog} onOpenChange={setShowCartDialog}>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>{dialogMode === 'add' ? 'خيارات الشراء' : 'قيد التطوير'}</DialogTitle>
							<DialogDescription>
								{dialogMode === 'add'
									? `تم إضافة ${safeProduct.nameAr} إلى السلة. ماذا تريد أن تفعل؟`
									: 'Working in development'}
							</DialogDescription>
						</DialogHeader>
						{dialogMode === 'add' && (
							<div className="flex gap-2 pt-4">
								<Button
									variant="outline"
									className="flex-1"
									onClick={() => setShowCartDialog(false)}
								>
									متابعة التسوق
								</Button>
								<Button className="flex-1" onClick={() => setDialogMode('development')}>
									تأكيد الشراء
								</Button>
							</div>
						)}
						{dialogMode === 'development' && (
							<div className="flex justify-end pt-4">
								<Button onClick={() => setShowCartDialog(false)}>إغلاق</Button>
							</div>
						)}
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
