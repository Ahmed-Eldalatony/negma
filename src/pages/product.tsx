import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Star, Check, Truck, Shield, Users, Zap, ShoppingCart, ArrowRight } from 'lucide-react';
import ColorSelector from '@/components/ColorSelector';
import OfferCard from '@/components/OfferCard';
import HeroSection from '@/components/HeroSection';
import OrderForm from '@/components/OrderForm';
import { Button } from '@/components/ui/button';
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
import { useStore } from '@/hooks/useStoreData';
import { faqs } from '@/shared/mock-data';

import { pixelTracker } from '@/lib/pixelTracking';
import { Metadata } from '@/components/Metadata';
// TODO: get the right type instead of any
export function meta() {
	return [{ title: 'منتج - نجمة' }, { name: 'description', content: 'تفاصيل المنتج' }];
}

export default function ProductPage() {
	const params = useParams();
	const navigate = useNavigate();
	const productId = params.id || '1';

	const { data: currentProduct, isLoading } = useProduct(productId);
	const { storedData } = useStore();

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

	const scrollToOrder = () => {
		document.getElementById('order-form')?.scrollIntoView({
			behavior: 'smooth',
		});
	};
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
			<Metadata
				title={`${currentProduct?.name} - ${storedData?.name || 'Store'}`}
				description={currentProduct?.description || 'Product details'}
				image={currentProduct?.media[0]?.url}
				url={window.location.href}
			/>
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

			<div className="space-y-3">
				<HeroSection
					product={safeProduct}
					productImages={productImages}
					currency={currency ?? undefined}
					onOrderClick={scrollToOrder}
				/>

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
				<OrderForm prices={currentProduct?.prices} currency={currency ?? undefined} />

				{/* FAQ Section */}
				<div className="py-8 bg-gradient-to-b from-muted/20 to-background">
					<div className="text-center mb-12 animate-fade-in">
						<h2 className="text-3xl md:text-5xl font-bold mb-4">الأسئلة الشائعة ❓</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							إجابات على جميع استفساراتك قبل الطلب
						</p>
					</div>
					<div className="max-w-3xl mx-auto">
						<Accordion type="single" collapsible className="space-y-4">
							{faqs.map((faq, index) => (
								<AccordionItem
									key={index}
									value={`item-${index}`}
									className="bg-card border-2 rounded-xl px-6 hover:border-primary/50 transition-colors animate-fade-in"
									style={{
										animationDelay: `${index * 0.05}s`,
									}}
								>
									<AccordionTrigger className="text-right hover:no-underline py-5">
										<span className="text-lg font-semibold">{faq.question}</span>
									</AccordionTrigger>
									<AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5">
										{faq.answer}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</div>

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
