import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const banners = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200",
    titleAr: "عروض حصرية",
    subtitleAr: "خصومات تصل إلى 50%",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200",
    titleAr: "منتجات جديدة",
    subtitleAr: "اكتشف أحدث المنتجات",
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div
      className="relative aspect-[16/9] bg-muted overflow-hidden"
      data-testid="hero-banner"
    >
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={banner.image}
            alt={banner.titleAr}
            className="w-full h-full object-cover"
            data-testid={`img-banner-${banner.id}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <div className="text-white">
              <h2
                className="text-xl font-bold mb-1"
                data-testid={`text-banner-title-${banner.id}`}
              >
                {banner.titleAr}
              </h2>
              <p
                className="text-sm"
                data-testid={`text-banner-subtitle-${banner.id}`}
              >
                {banner.subtitleAr}
              </p>
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        className="!absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={prevSlide}
        data-testid="button-prev-slide"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="!absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={nextSlide}
        data-testid="button-next-slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-4" : "bg-white/50"
            }`}
            data-testid={`button-slide-indicator-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
