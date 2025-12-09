import { Badge } from '@/components/ui/badge';
import { Sparkles, TruckIcon, Award, Timer, Star } from 'lucide-react';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { useStore } from '@/hooks/useStoreData';

interface HeroSectionProps {
	product: {
		id: string;
		name: string;
		image: string;
		price: number;
		originalPrice?: number;
		discount?: number;
		rating?: number;
		reviewCount?: number;
		description?: string;
	};
	productImages: string[];
	currency?: {
		currency: string;
		rate_to_usd: string | number;
	};
}

const HeroSection = ({ product, productImages, currency }: HeroSectionProps) => {
	const { storedData } = useStore();
	const rate = currency
		? typeof currency.rate_to_usd === 'string'
			? parseFloat(currency.rate_to_usd)
			: currency.rate_to_usd
		: 1;
	const convertedPrice = currency ? product.price * rate : product.price;
	const convertedOriginalPrice =
		product.originalPrice && currency ? product.originalPrice * rate : product.originalPrice;

	const formatPrice = (price: number) => {
		if (currency) {
			return `${price.toFixed(2)} ${currency.currency}`;
		}
		return `$${price.toFixed(2)}`;
	};

	const discountPercent =
		product.discount ||
		(product.originalPrice
			? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
			: 0);

	return (
		<section className="py-3 px-3 bg-background">
			{/* Store Logo/Name */}
			<div className="text-center mb-4">
				<h2 className="text-xl font-bold">{storedData?.name || 'متجر العناية الكورية'}</h2>
				<p className="text-xs text-muted-foreground">
					{storedData?.settings?.description || 'منتجات أصلية 100%'}
				</p>
			</div>

			<div className="max-w-md mx-auto">
				{/* Product Image Carousel */}
				<div className="relative mb-4 animate-scale-in">
					<div className="relative">
						<Carousel className="w-full ">
							<CarouselContent className="-ml-1 ">
								{productImages.map((img, index) => (
									<CarouselItem key={index} className="pl-1">
										<div className="relative aspect-square">
											<img
												src={img}
												alt={`صورة المنتج ${index + 1}`}
												className="w-full   h-full object-cover rounded-lg shadow-soft"
												onError={(e) => {
													console.error(`Failed to load image ${index + 1}:`, img);
													e.currentTarget.style.display = 'none';
												}}
											/>
										</div>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious className="left-2 bg-white/90 hover:bg-white" />
							<CarouselNext className="right-2 bg-white/90 hover:bg-white" />
						</Carousel>
					</div>

					{discountPercent > 0 && (
						<div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-3 py-1 rounded-full font-bold text-xs">
							خصم {discountPercent}%
						</div>
					)}
					{product.rating && (
						<div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs flex  gap-1">
							<Star className="w-4 h-4 fill-current" />
							<span>{product.rating}</span>
						</div>
					)}
				</div>

				{/* Product Details */}
				<div className="mb-3 text-start ">
					<h1 className="text-lg font-bold mb-2 leading-tight">{product.name}</h1>
					{product.rating && product.reviewCount && (
						<div className="flex items-center gap-2 mb-2 text-xs">
							<div className="flex items-center gap-1 rounded-2xl">
								{[...Array(5)].map((_, i) => (
									<Star key={i} className="w-4 h-4 fill-primary text-primary-foreground " />
								))}
							</div>
							<span className="text-muted-foreground">({product.reviewCount} تقييم)</span>
						</div>
					)}
					{product.description && (
						<p className="text-sm text-muted-foreground mb-2">{product.description}</p>
					)}
					<div className="flex gap-2 flex-wrap text-xs">
						<Badge variant="secondary">✓ عملي وقوي</Badge>
						<Badge variant="secondary">✓ جودة عالية</Badge>
						<Badge variant="secondary">✓ خالي من البارابين</Badge>
					</div>
				</div>

				{/* Price */}
				<div className="bg-secondary rounded-lg p-3 mb-3">
					<div className="flex items-center justify-between mb-2">
						<div>
							<div className="flex items-center gap-2 flex-wrap">
								<span className="text-3xl font-bold">{formatPrice(convertedPrice)}</span>
								{convertedOriginalPrice && (
									<span className="text-sm line-through text-muted-foreground">
										{formatPrice(convertedOriginalPrice)}
									</span>
								)}
							</div>
							{convertedOriginalPrice && (
								<div className="mt-1">
									<span className="text-sm font-semibold text-green-600">
										وفر {formatPrice(convertedOriginalPrice - convertedPrice)} ({discountPercent}%)
									</span>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Key Info Grid */}
				<div className="grid grid-cols-4 gap-2 mb-3">
					<div className="bg-card border border-border rounded-md p-2 text-center">
						<TruckIcon className="w-4 h-4 mx-auto mb-1" />
						<p className="text-[10px] font-semibold">توصيل مجاني</p>
					</div>
					<div className="bg-card border border-border rounded-md p-2 text-center">
						<Award className="w-4 h-4 mx-auto mb-1" />
						<p className="text-[10px] font-semibold">منتج أصلي</p>
					</div>
					<div className="bg-card border border-border rounded-md p-2 text-center">
						<Sparkles className="w-4 h-4 mx-auto mb-1" />
						<p className="text-[10px] font-semibold">+500 طلب</p>
					</div>
					<div className="bg-card border border-border rounded-md p-2 text-center">
						<Timer className="w-4 h-4 mx-auto mb-1" />
						<p className="text-[10px] font-semibold">توصيل سريع</p>
					</div>
				</div>

				{/* Additional Details */}

				{/* Trust */}
				<p className="text-xs text-center text-slate-950">
					✓ آمن ومضمون - لا تدفع الآن | ضمان الاسترجاع 30 يوم
				</p>
			</div>
		</section>
	);
};
export default HeroSection;
