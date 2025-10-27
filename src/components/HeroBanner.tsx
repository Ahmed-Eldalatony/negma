import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/hooks/useStoreData';

export default function HeroBanner() {
	const { storedData } = useStore();
	const banners =
		storedData?.banners?.map((banner, index) => ({
			id: `banner-${index}`,
			image: banner.url,
			titleAr: banner.description,
			subtitleAr: '',
		})) || [];
	const [currentSlide, setCurrentSlide] = useState(0);

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % banners.length);
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
	};

	return (
		<div className="bg-muted relative aspect-[16/9] overflow-hidden" data-testid="hero-banner">
			{banners.map((banner, index) => (
				<div
					key={banner.id}
					className={`absolute inset-0 transition-opacity duration-500 ${
						index === currentSlide ? 'opacity-100' : 'opacity-0'
					}`}
				>
					<img
						src={banner.image}
						alt={banner.titleAr}
						className="h-full w-full object-cover"
						data-testid={`img-banner-${banner.id}`}
					/>
					<div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4">
						<div className="text-white">
							<h2
								className="mb-1 text-xl font-bold"
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
				className="!absolute top-1/2 right-1 -translate-y-1/2 bg-white/80 hover:bg-white"
				onClick={prevSlide}
				data-testid="button-prev-slide"
			>
				<ChevronRight className="h-5 w-5" />
			</Button>

			<Button
				variant="ghost"
				size="icon"
				className="!absolute top-1/2 left-1 -translate-y-1/2 bg-white/80 hover:bg-white"
				onClick={nextSlide}
				data-testid="button-next-slide"
			>
				<ChevronLeft className="h-5 w-5" />
			</Button>

			<div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
				{banners.map((_, index) => (
					<button
						key={index}
						onClick={() => setCurrentSlide(index)}
						className={`h-2 w-2 rounded-full transition-all ${
							index === currentSlide ? 'w-4 bg-white' : 'bg-white/50'
						}`}
						data-testid={`button-slide-indicator-${index}`}
					/>
				))}
			</div>
		</div>
	);
}
