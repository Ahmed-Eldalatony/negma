import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export function meta() {
	return [
		{ title: 'صفحة غير موجودة - نجمة' },
		{ name: 'description', content: 'الصفحة التي تبحث عنها غير موجودة' },
	];
}

export default function NotFoundPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
			<div className="space-y-6">
				<div className="space-y-2">
					<h1 className="text-6xl font-bold text-primary">404</h1>
					<h2 className="text-2xl font-semibold">الصفحة غير موجودة</h2>
					<p className="text-muted-foreground">
						عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
					</p>
				</div>

				<div className="flex flex-col gap-3 sm:flex-row">
					<Button asChild className="flex items-center gap-2">
						<Link to="/">
							<Home className="h-4 w-4" />
							العودة للرئيسية
						</Link>
					</Button>
					<Button
						variant="outline"
						onClick={() => window.history.back()}
						className="flex items-center gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						العودة للخلف
					</Button>
				</div>
			</div>
		</div>
	);
}
