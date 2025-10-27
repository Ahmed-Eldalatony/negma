import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CategoryCardSkeletonProps {
	className?: string;
}

export default function CategoryCardSkeleton({ className }: CategoryCardSkeletonProps) {
	return (
		<div className={cn('w-full flex-shrink-0', className)}>
			<div className="bg-muted mb-2 aspect-square overflow-hidden rounded-md">
				<Skeleton className="h-full w-full" />
			</div>
			<Skeleton className="h-3 w-16 mx-auto" />
		</div>
	);
}
