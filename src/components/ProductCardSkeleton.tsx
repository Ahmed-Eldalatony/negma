import { Skeleton } from '@/components/ui/skeleton';

export default function ProductCardSkeleton() {
	return (
		<div className="group relative h-[280px] overflow-hidden rounded-md border border-gray-300">
			<div className="relative bg-muted mb-2 aspect-square overflow-hidden">
				<Skeleton className="h-full w-full" />
			</div>

			<div className="space-y-1 pr-2">
				<Skeleton className="h-4 w-3/4" />
				<Skeleton className="h-4 w-1/2" />
				<Skeleton className="h-3 w-1/4" />
			</div>
		</div>
	);
}
