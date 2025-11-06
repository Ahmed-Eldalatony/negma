import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
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
	ShoppingCart,
	ArrowRight,
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
import { useCartStore } from '@/store';
import { useProduct } from '@/hooks/useProducts';
import { useCurrency } from '@/hooks/useCurrency';
import { convertPrice, formatPrice } from '@/lib/utils';
import { pixelTracker } from '@/lib/pixelTracking';
// TODO: get the right type instead of any
export function meta() {
	return [{ title: 'منتج - نجمة' }, { name: 'description', content: 'تفاصيل المنتج' }];
}

export default function ProductPage() {
	const params = useParams();
	const navigate = useNavigate();
	const productId = params.id || '1';

	const { data: currentProduct, isLoading } = useProduct(productId);

	useEffect(() => {
		if (currentProduct) {
			pixelTracker.trackEventForAll('ViewContent', {
				content_ids: [currentProduct.id.toString()],
				content_type: 'product',
			});
		}
	}, [currentProduct]);

	let product = null;
	if (currentProduct) {
		const safeProduct = currentProduct!;
		product = {
			id: safeProduct.id.toString(),
			name: safeProduct.name,
			nameAr: safeProduct.name,
			image: safeProduct.media[0]?.url || '',
			price: parseFloat(safeProduct.prices[0]?.price_in_usd || '0'),
			originalPrice: undefined as number | undefined,
			discount: undefined as number | undefined,
			category: '',
			categoryAr: '',
			inStock: safeProduct.inventory > 0,
			stockCount: safeProduct.inventory,
			rating: undefined as number | undefined,
			reviewCount: undefined as number | undefined,
			description: safeProduct.description,
			descriptionAr: safeProduct.description,
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
		};
	}
	const [selectedOffer, setSelectedOffer] = useState('');
	const [selectedColor, setSelectedColor] = useState('');
	// const [quantity, setQuantity] = useState(1);

	// const increaseQuantity = () => setQuantity(prev => prev + 1);
	// const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

	const { addToCart, isInCart } = useCartStore();
	const { currency } = useCurrency();
	const [showCartDialog, setShowCartDialog] = useState(false);
	const [dialogMode, setDialogMode] = useState<'add' | 'development'>('add');
	const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
	const [showFullDescription, setShowFullDescription] = useState(false);

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

	// Ensure currentProduct exists for price packages
	if (!currentProduct) {
		return (
			<div className="bg-background min-h-screen mb-40">
				<div className="space-y-3 p-4">
					<div>Product data not available</div>
				</div>
			</div>
		);
	}

	const convertedPrice = currency
		? convertPrice(safeProduct.price, currency.rate_to_usd)
		: safeProduct.price;
	const convertedOriginalPrice =
		safeProduct.originalPrice && currency
			? convertPrice(safeProduct.originalPrice, currency.rate_to_usd)
			: safeProduct.originalPrice;

	const priceDisplay = currency
		? formatPrice(convertedPrice, currency.currency)
		: `$${safeProduct.price}`;
	const originalPriceDisplay =
		convertedOriginalPrice && currency
			? formatPrice(convertedOriginalPrice, currency.currency)
			: safeProduct.originalPrice
				? `$${safeProduct.originalPrice}`
				: null;

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
			{/* Header with Back Button */}
			<div className="bg-background sticky top-0 z-40 border-b p-4">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate('/')}
					className="flex items-center gap-2 px-0 text-muted-foreground hover:text-foreground"
				>
					<ArrowRight className="h-4 w-4" />
					<span>العودة</span>
				</Button>
			</div>

			<div className="space-y-3 p-4">
				{/* Product Image Gallery */}
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
					<ProductImageGallery images={productImages} productName={safeProduct.name} />
				</div>

				{/* Product Title and Basic Info */}
				<div>
					<div className="flex items-center gap-2 mt-1">
						{safeProduct.rating && (
							<div className="flex items-center">
								<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
								<span className="text-sm ml-1">{safeProduct.rating}</span>
							</div>
						)}
						{safeProduct.reviewCount && (
							<span className="text-sm text-muted-foreground">
								({safeProduct.reviewCount} تقييم)
							</span>
						)}
					</div>
				</div>

				{/* Price Section */}
				<div className="bg-muted rounded-md p-3">
					<div className="flex items-end justify-between">
						<div className="flex-1">
							<div className=" mb-1 flex  ">
								{originalPriceDisplay && (
									<span className="line-through ">{originalPriceDisplay}</span>
								)}
								<div className="flex items-center justify-between w-full gap-2">
									<h1 className="text-xl font-bold">{safeProduct.name}</h1>
									<span className="block text-2xl font-bold" data-testid="text-main-price">
										{priceDisplay}
									</span>
								</div>
							</div>

							{convertedOriginalPrice && (
								<div className="text-muted-foreground mt-1 text-xs">
									وفر{' '}
									{currency
										? formatPrice(convertedOriginalPrice - convertedPrice, currency.currency)
										: `$${(convertedOriginalPrice - convertedPrice).toFixed(2)}`}{' '}
									(خصم {safeProduct.discount}%)
								</div>
							)}
						</div>
					</div>
					<div className="flex  text-sm">
						<span className="font-medium ml-2">الكمية المتوفرة:</span>
						<span
							className={`text-sm font-medium ${
								currentProduct.inventory > 10
									? 'text-green-600'
									: currentProduct.inventory > 0
										? 'text-orange-600'
										: 'text-red-600'
							}`}
						>
							{currentProduct.inventory > 10
								? `${currentProduct.inventory} قطعة`
								: currentProduct.inventory > 0
									? `متبقي ${currentProduct.inventory} قطعة`
									: 'غير متوفر'}
						</span>
					</div>

					{/* Product Description in Price Card */}
					{safeProduct.description && (
						<div className="mt-3 text-start pt-3 border-t border-border/50">
							<p
								className="text-muted-foreground text-sm leading-relaxed"
								data-testid="text-description"
							>
								{safeProduct.description.length > 150 && !showFullDescription
									? `${safeProduct.description.substring(0, 150)}...`
									: safeProduct.description}
							</p>
							{safeProduct.description.length > 150 && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setShowFullDescription(!showFullDescription)}
									className="mt-2 h-auto p-0 text-xs text-primary hover:text-primary/80"
								>
									{showFullDescription ? 'عرض أقل' : 'اقرأ المزيد'}
								</Button>
							)}
						</div>
					)}
				</div>

				{/* Price Packages */}
				{currentProduct?.prices &&
					currentProduct.prices.filter((p) => p.min_quantity > 1).length > 0 && (
						<div className="space-y-3">
							{/* <h3 className="text-sm font-medium">أسعار الجملة</h3> */}
							<div className="grid grid-cols-1 gap-2">
								{currentProduct.prices
									.filter((p) => p.min_quantity > 1)
									.sort((a, b) => a.min_quantity - b.min_quantity)
									.map((pricePackage) => {
										const packagePrice = currency
											? convertPrice(parseFloat(pricePackage.price_in_usd), currency.rate_to_usd)
											: parseFloat(pricePackage.price_in_usd);
										const packagePriceDisplay = currency
											? formatPrice(packagePrice, currency.currency)
											: `$${packagePrice.toFixed(2)}`;
										const pricePerUnit = packagePrice / pricePackage.min_quantity;
										const pricePerUnitDisplay = currency
											? formatPrice(pricePerUnit, currency.currency)
											: `$${pricePerUnit.toFixed(2)}`;

										const isSelected = selectedPackage === pricePackage.id.toString();

										return (
											<div
												key={pricePackage.id}
												className={`border rounded-lg p-3 cursor-pointer transition-colors ${
													isSelected
														? 'border-primary bg-primary/5'
														: 'border-border hover:border-primary/50'
												}`}
												onClick={() =>
													setSelectedPackage(isSelected ? null : pricePackage.id.toString())
												}
											>
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-3">
														<div
															className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
																isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
															}`}
														>
															{isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
														</div>
														<div>
															<div className="font-medium text-start text-sm">
																{pricePackage.min_quantity} قطع
															</div>
															<div className="text-xs text-muted-foreground">
																{pricePerUnitDisplay} للقطعة
															</div>
														</div>
													</div>
													<div className="text-left">
														<div className="font-bold text-sm">{packagePriceDisplay}</div>
														<div className="text-xs text-green-600">
															وفر{' '}
															{(() => {
																const singleUnitPrice = currency
																	? convertPrice(
																			parseFloat(currentProduct.prices[0]?.price_in_usd || '0'),
																			currency.rate_to_usd
																		)
																	: parseFloat(currentProduct.prices[0]?.price_in_usd || '0');
																const individualTotal = singleUnitPrice * pricePackage.min_quantity;
																const savings = individualTotal - packagePrice;
																return currency
																	? formatPrice(savings, currency.currency)
																	: `$${savings.toFixed(2)}`;
															})()}
														</div>
													</div>
												</div>
											</div>
										);
									})}
							</div>
						</div>
					)}

				{/* Color Selector */}
				{safeProduct.colors && (
					<div className="bg-muted rounded-md p-3">
						<h3 className="font-medium mb-2">اللون</h3>
						<ColorSelector
							colors={safeProduct.colors}
							selectedColor={selectedColor}
							onColorSelect={setSelectedColor}
						/>
					</div>
				)}

				{/* Offers */}
				{safeProduct.offers && safeProduct.offers.length > 0 && (
					<div className="bg-muted rounded-md p-3">
						<h3 className="font-medium mb-2">العروض</h3>
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
					</div>
				)}

				{/* Features Grid */}
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

				{/* Order Section */}
				<div className="bg-muted space-y-3 rounded-md p-3">
					<div className="bg-destructive/20 rounded-md p-2">
						<div className="mb-1 text-center">
							<span className="text-xs font-medium">ينتهي العرض خلال:</span>
						</div>
						<CountdownTimer />
					</div>

					<Button
						className="bg-primary hover:bg-primary/90 h-12 w-full text-sm font-bold"
						onClick={() => console.log('Order placed')}
						data-testid="button-order-main"
					>
						اطلب الآن - الدفع عند الاستلام
					</Button>

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
				</div>

				{/* Policies Accordion */}
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

				{/* Additional Features Grid */}
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

				{/* Reviews Section */}
				<div className="space-y-3">
					<h3 className="font-medium">التقييمات</h3>
					<div className="space-y-3">
						{reviews.map((review) => (
							<div
								key={review.id}
								className="rounded-md border p-4"
								data-testid={`review-${review.id}`}
							>
								<div className="mb-2 flex justify-between">
									<div className="text-start">
										<div className="flex items-center gap-2">
											<span className="font-medium">{review.customer_name}</span>
											<Check className="h-4 w-4 text-green-600" />
										</div>

										<span className="text-muted-foreground text-xs">
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
			</div>

			{/* Fixed Bottom Order Button */}
			<div className="bg-background fixed right-0 bottom-0 left-0 z-50 border-t p-3">
				<div className="mx-auto max-w-md space-y-2">
					<div className="flex gap-2">
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
							<Button variant="outline" className="flex-1" onClick={() => setShowCartDialog(false)}>
								متابعة التسوق
							</Button>
							<Button
								className="flex-1"
								onClick={() => {
									setShowCartDialog(false);
									navigate('/checkout');
								}}
							>
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
	);
}
