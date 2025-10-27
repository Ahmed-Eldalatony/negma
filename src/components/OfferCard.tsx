import { Badge } from '@/components/ui/badge';
import type { Offer } from '@/shared/mock-data';

interface OfferCardProps {
	offer: Offer;
	isSelected?: boolean;
	onSelect?: () => void;
}

export default function OfferCard({ offer, isSelected = false, onSelect }: OfferCardProps) {
	return (
		<button
			onClick={() => {
				onSelect?.();
			}}
			className={`w-full rounded-md border p-4 text-right transition-all ${
				isSelected ? 'border-primary bg-accent' : 'hover-elevate'
			}`}
			data-testid={`button-offer-${offer.id}`}
		>
			<div className="mb-2 flex items-start justify-between gap-2">
				<div className="flex-1">
					<h3
						className="mb-1 text-sm font-medium"
						data-testid={`text-offer-title-${offer.id}`}
					>
						{offer.titleAr}
					</h3>
					{offer.isLimited && offer.limitedCount && (
						<Badge
							variant="outline"
							className="text-xs"
							data-testid={`badge-limited-${offer.id}`}
						>
							محدود {offer.limitedCount} قطعة
						</Badge>
					)}
				</div>
				<div
					className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
						isSelected ? 'border-primary' : 'border-input'
					}`}
					data-testid={`radio-offer-${offer.id}`}
				>
					{isSelected && <div className="bg-primary h-2.5 w-2.5 rounded-full" />}
				</div>
			</div>

			<div className="flex items-center gap-2">
				<span className="text-lg font-bold" data-testid={`text-offer-price-${offer.id}`}>
					${offer.newPrice.toFixed(2)}
				</span>
				<span
					className="text-muted-foreground text-sm line-through"
					data-testid={`text-offer-original-${offer.id}`}
				>
					${offer.originalPrice.toFixed(2)}
				</span>
				{offer.isLimited && (
					<Badge
						variant="outline"
						className="mr-auto text-xs"
						data-testid={`badge-free-shipping-${offer.id}`}
					>
						شحن مجاني
					</Badge>
				)}
			</div>
		</button>
	);
}
