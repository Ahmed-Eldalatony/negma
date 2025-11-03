import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const mockOrder = {
	id: 'ORD-12345',
	status: 'Processing',
	date: '2025-11-03',
	total: '$125.50',
	items: [
		{ id: 'p1', name: 'Product 1', quantity: 2, price: '$50.00' },
		{ id: 'p2', name: 'Product 2', quantity: 1, price: '$25.50' },
	],
	shippingAddress: {
		fullName: 'John Doe',
		country: 'Egypt',
		city: 'Cairo',
		detailedAddress: '123 Main St, Cairo, Egypt',
	},
	contact: {
		primaryPhone: '01234567890',
		additionalPhone: '09876543210',
	},
};

const OrdersPage = () => {
	const [order, setOrder] = useState(mockOrder);

	const handleCancelOrder = () => {
		setOrder((prev) => ({ ...prev, status: 'Cancelled' }));
		alert('تم إلغاء الطلب بنجاح');
	};

	return (
		<div className="bg-background w-sm min-h-screen flex flex-col">
			<header className="bg-background sticky top-0 z-40 border-b p-4">
				<div className="flex items-center">
					<Link to="/" aria-label="العودة إلى الصفحة الرئيسية">
						<Button variant="ghost" size="icon">
							<ArrowRight className="h-5 w-5" />
						</Button>
					</Link>
					<h1 className="flex-1 text-center text-lg font-bold">طلباتي</h1>
				</div>
			</header>

			<main className="p-4 flex-1" dir="rtl">
				<div className="space-y-6">
					<section className="flex justify-between items-start">
						<div>
							<h2 className="text-xl font-semibold">رقم الطلب: {order.id}</h2>
							<p className="text-muted-foreground">تاريخ الطلب: {order.date}</p>
						</div>
						<Badge variant={order.status === 'Processing' ? 'default' : 'destructive'}>
							{order.status === 'Processing' ? 'قيد المعالجة' : 'ملغي'}
						</Badge>
					</section>

					<Separator />

					<section>
						<h3 className="text-lg font-medium mb-3">تفاصيل المنتجات</h3>
						<div className="space-y-2">
							{order.items.map((item) => (
								<div key={item.id} className="flex justify-between">
									<span>
										{item.name} (الكمية: {item.quantity})
									</span>
									<span>{item.price}</span>
								</div>
							))}
						</div>
						<Separator className="my-3" />
						<div className="flex justify-between font-semibold">
							<span>المجموع الكلي:</span>
							<span>{order.total}</span>
						</div>
					</section>

					<Separator />

					<section>
						<h3 className="text-lg font-medium mb-3">عنوان الشحن</h3>
						<address className="not-italic space-y-1 text-muted-foreground">
							<p>{order.shippingAddress.fullName}</p>
							<p>{order.shippingAddress.detailedAddress}</p>
							<p>
								{order.shippingAddress.city}, {order.shippingAddress.country}
							</p>
						</address>
					</section>

					<Separator />

					<section>
						<h3 className="text-lg font-medium mb-3">معلومات الاتصال</h3>
						<div className="space-y-1 text-muted-foreground">
							<p>رقم الهاتف الأساسي: {order.contact.primaryPhone}</p>
							{order.contact.additionalPhone && (
								<p>رقم هاتف إضافي: {order.contact.additionalPhone}</p>
							)}
						</div>
					</section>

					{order.status === 'Processing' && (
						<div className="pt-2">
							<Button variant="destructive" onClick={handleCancelOrder} className="w-full">
								إلغاء الطلب
							</Button>
						</div>
					)}
				</div>
			</main>

			<BottomNav />
		</div>
	);
};

export default OrdersPage;
