import { Badge } from "~/components/ui/badge";
import type { Offer } from "~/shared/mock-data";

interface OfferCardProps {
  offer: Offer;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function OfferCard({ offer, isSelected = false, onSelect }: OfferCardProps) {
  return (
    <button
      onClick={() => {
        console.log('Offer selected:', offer.titleAr);
        onSelect?.();
      }}
      className={`w-full p-4 border rounded-md text-right transition-all ${
        isSelected 
          ? "border-primary bg-accent" 
          : " hover-elevate"
      }`}
      data-testid={`button-offer-${offer.id}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <h3 className="font-medium text-sm mb-1" data-testid={`text-offer-title-${offer.id}`}>
            {offer.titleAr}
          </h3>
          {offer.isLimited && offer.limitedCount && (
            <Badge variant="outline" className="text-xs" data-testid={`badge-limited-${offer.id}`}>
              محدود {offer.limitedCount} قطعة
            </Badge>
          )}
        </div>
        <div 
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            isSelected ? "border-primary" : "border-input"
          }`}
          data-testid={`radio-offer-${offer.id}`}
        >
          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold" data-testid={`text-offer-price-${offer.id}`}>
          ${offer.newPrice.toFixed(2)}
        </span>
        <span className="text-sm text-muted-foreground line-through" data-testid={`text-offer-original-${offer.id}`}>
          ${offer.originalPrice.toFixed(2)}
        </span>
        {offer.isLimited && (
          <Badge variant="outline" className="mr-auto text-xs" data-testid={`badge-free-shipping-${offer.id}`}>
            شحن مجاني
          </Badge>
        )}
      </div>
    </button>
  );
}
