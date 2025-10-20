import type { Route } from "./+types/product.$id";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowRight, Star, Check, Truck, Shield, Users, Zap, ChevronDown, MessageCircle, Plus, Minus, User, Phone, MapPin } from "lucide-react";
import ProductImageGallery from "~/components/ProductImageGallery";
import ColorSelector from "~/components/ColorSelector";
import OfferCard from "~/components/OfferCard";
import CountdownTimer from "~/components/CountdownTimer";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { products } from "~/shared/mock-data";

export function meta({ params }: Route.MetaArgs) {
  const product = products.find(p => p.id === params.id);
  return [
    { title: `${product?.nameAr || 'منتج'} - نجمة` },
    { name: "description", content: product?.descriptionAr || 'تفاصيل المنتج' },
  ];
}

export default function ProductPage() {
  const params = useParams();
  const productId = params.id || "1";
  
  const product = products.find(p => p.id === productId) || products[0];
  const [selectedOffer, setSelectedOffer] = useState(product.offers?.[0]?.id || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[3] || '');
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const productImages = [product.image, product.image, product.image];

  // TODO: remove mock functionality
  const reviews = [
    { id: 1, name: 'محمد رضا', verified: true, time: 'منذ 3 أيام', rating: 4, comment: 'أداء مذهل، وجودة عالية. أنصح الجميع بشرائها!' },
    { id: 2, name: 'فاطمة وليد', verified: true, time: 'منذ أسبوع', rating: 5, comment: 'جودة عالية وسعر مناسب. استحقت كل الثناء.' },
    { id: 3, name: 'زينب حسين', verified: true, time: 'منذ 3 أيام', rating: 5, comment: 'سهلة الاستخدام وعطور أنيق، منتج رائع بكل تأكيد.' },
    { id: 4, name: 'عبدالله حسان', verified: true, time: 'منذ 4 أيام', rating: 4, comment: 'منتج عملي ومنظم، لا أستطيع الاستغناء عنه الآن.' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-3">
        <div className="relative">
          {product.rating && (
            <Badge 
              className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground text-sm font-bold flex items-center gap-1"
              data-testid="badge-rating"
            >
              <Star className="h-3 w-3 fill-current" />
              {product.rating}
            </Badge>
          )}
          {product.discount && (
            <Badge 
              variant="destructive" 
              className="absolute top-3 left-3 z-10 text-sm font-bold"
              data-testid="badge-discount-main"
            >
              خصم {product.discount}%
            </Badge>
          )}
          <ProductImageGallery images={productImages} productName={product.nameAr} />
        </div>

        <div className="bg-muted rounded-md p-3">
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <div className="text-xs text-muted-foreground mb-1">
                {product.originalPrice && (
                  <span className="line-through">{product.originalPrice.toFixed(0)} ريال</span>
                )}
              </div>
              <span className="text-2xl font-bold block" data-testid="text-main-price">
                {product.price} ريال
              </span>
              {product.originalPrice && (
                <div className="text-xs text-muted-foreground mt-1">
                  وفر {product.originalPrice - product.price} ريال (خصم {product.discount}%)
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">الحجم</div>
              <div className="text-sm font-medium">50 مل</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-3 border rounded-md">
            <Zap className="h-5 w-5 mx-auto mb-1" />
            <div className="text-[10px] font-medium">توصيل سريع</div>
          </div>
          <div className="p-3 border rounded-md">
            <Users className="h-5 w-5 mx-auto mb-1" />
            <div className="text-[10px] font-medium">500+ طلب</div>
          </div>
          <div className="p-3 border rounded-md">
            <Shield className="h-5 w-5 mx-auto mb-1" />
            <div className="text-[10px] font-medium">منتج أصلي</div>
          </div>
          <div className="p-3 border rounded-md">
            <Truck className="h-5 w-5 mx-auto mb-1" />
            <div className="text-[10px] font-medium">توصيل مجاني</div>
          </div>
        </div>

        <div className="space-y-2 bg-muted rounded-md p-3">
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
          className="w-full font-bold text-sm h-12 bg-primary hover:bg-primary/90"
          onClick={() => console.log('Order placed')}
          data-testid="button-order-main"
        >
          اطلب الآن - الدفع عند الاستلام
        </Button>

        <div className="bg-destructive/10 rounded-md p-2">
          <div className="text-center mb-1">
            <span className="text-xs font-medium">ينتهي العرض خلال:</span>
          </div>
          <CountdownTimer />
        </div>

        {product.colors && (
          <ColorSelector
            colors={product.colors}
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />
        )}

        <div className="bg-muted p-3 rounded-md flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm font-medium">لإجراء طلب، يرجى إدخال معلوماتك هنا:</span>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="الاسم الأول"
              className="w-full px-3 py-2 pl-10 bg-background border border-input rounded-md text-sm text-right"
              data-testid="input-first-name"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="tel"
              placeholder="رقم الهاتف"
              className="w-full px-3 py-2 pl-10 bg-background border border-input rounded-md text-sm text-right"
              data-testid="input-phone"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="عنوان التوصيل"
              className="w-full px-3 py-2 pl-10 bg-background border-2 border-primary rounded-md text-sm font-medium text-right"
              data-testid="input-address"
            />
          </div>
        </div>

        {product.offers && product.offers.length > 0 && (
          <div className="space-y-2">
            {product.offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                isSelected={selectedOffer === offer.id}
                onSelect={() => setSelectedOffer(offer.id)}
              />
            ))}
          </div>
        )}

        {product.descriptionAr && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-description">
              {product.descriptionAr}
            </p>
          </div>
        )}

        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="payment" className="border rounded-md px-4">
            <AccordionTrigger className="hover:no-underline py-3 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>سياسة الدفع عند الاستلام</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 text-sm text-muted-foreground">
              الدفع عند وصول المنتج. الدفع عند وصول المنتج المنتج
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="guarantee" className="border rounded-md px-4">
            <AccordionTrigger className="hover:no-underline py-3 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>ضمان 30 يوماً</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 text-sm text-muted-foreground">
              ضمان استرداد المال في حالة عدم الرضا عن المنتج
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shipping" className="border rounded-md px-4">
            <AccordionTrigger className="hover:no-underline py-3 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>الشحن</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 text-sm text-muted-foreground">
              شحن مجاني على جميع الطلبات فوق 50$. التوصيل خلال 2-4 أيام عمل
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="return" className="border rounded-md px-4">
            <AccordionTrigger className="hover:no-underline py-3 text-sm font-medium">
              <div className="flex items-center gap-2">
                <ChevronDown className="h-4 w-4" />
                <span>سياسة الإرجاع</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 text-sm text-muted-foreground">
              يمكنك إرجاع المنتج خلال 30 يوماً من تاريخ الاستلام
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="grid grid-cols-2 gap-3 bg-muted rounded-md p-4">
          <div className="text-center p-3 bg-background rounded-md">
            <Zap className="h-6 w-6 mx-auto mb-2" />
            <div className="text-sm font-medium">شحن مجاني</div>
            <div className="text-xs text-muted-foreground">عند الشراء بأكثر من 99 دولار</div>
          </div>
          <div className="text-center p-3 bg-background rounded-md">
            <Shield className="h-6 w-6 mx-auto mb-2" />
            <div className="text-sm font-medium">إرجاع سهل</div>
            <div className="text-xs text-muted-foreground">تم تحديد سياسة الإرجاع إلى 60 يوماً</div>
          </div>
          <div className="text-center p-3 bg-background rounded-md">
            <Check className="h-6 w-6 mx-auto mb-2" />
            <div className="text-sm font-medium">الدفع عند الاستلام</div>
            <div className="text-xs text-muted-foreground">الدفع عند وصول المنتج</div>
          </div>
          <div className="text-center p-3 bg-background rounded-md">
            <Users className="h-6 w-6 mx-auto mb-2" />
            <div className="text-sm font-medium">دعم العملاء</div>
            <div className="text-xs text-muted-foreground">من الإثنين إلى السبت</div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold">ماذا يقول عملاؤنا</h3>
          <div className="bg-muted p-3 rounded-md text-center">
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
              <div key={review.id} className="border rounded-md p-4" data-testid={`review-${review.id}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.name}</span>
                      {review.verified && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{review.time}</span>
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
                <p className="text-sm text-muted-foreground">{review.comment}</p>
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
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t  z-50 p-3">
        <div className="max-w-mobile mx-auto space-y-2">
          <Button 
            className="w-full font-bold text-sm h-11 bg-primary hover:bg-primary/90"
            onClick={() => console.log('Order placed')}
            data-testid="button-order-fixed"
          >
            اطلب الآن - الدفع عند الاستلام
          </Button>
          
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="flex items-center justify-center gap-1">
              <Check className="h-3 w-3 text-destructive" />
              <span>ضمان 30 يوماً</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Truck className="h-3 w-3 text-yellow-600" />
              <span>شحن مجاني</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Shield className="h-3 w-3 text-destructive" />
              <span>الدفع عند الاستلام</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
