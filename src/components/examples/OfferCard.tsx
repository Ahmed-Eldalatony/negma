import { useState } from 'react';
import OfferCard from '../OfferCard';
import type { Offer } from '@/shared/mock-data';

export default function OfferCardExample() {
  const [selectedOffer, setSelectedOffer] = useState<string>('1');

  const offers: Offer[] = [
    { 
      id: '1', 
      title: 'Buy 1', 
      titleAr: 'اريد واحدة فقط', 
      discount: 50, 
      originalPrice: 54.50, 
      newPrice: 33.00 
    },
    { 
      id: '2', 
      title: 'Buy 2 Get 10% Off', 
      titleAr: 'اشتري 2 و احصل على خصم 10%', 
      discount: 10, 
      originalPrice: 66.00, 
      newPrice: 59.40 
    },
    { 
      id: '3', 
      title: 'Buy 3 Get 15% Off', 
      titleAr: 'اشتري 3 و احصل على خصم 15%', 
      discount: 15, 
      originalPrice: 99.00, 
      newPrice: 84.15,
      isLimited: true,
      limitedCount: 30 
    },
  ];

  return (
    <div className="p-4 space-y-3 max-w-mobile mx-auto">
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          isSelected={selectedOffer === offer.id}
          onSelect={() => setSelectedOffer(offer.id)}
        />
      ))}
    </div>
  );
}
