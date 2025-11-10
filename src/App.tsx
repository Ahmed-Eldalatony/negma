import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
// import { Bsdge } from '@/components/ui/badge';
// // import { useCounterStore } from './store';
// // import { useTranslation } from 'react-i18next';
import ProductPage from './pages/product';
import CategoryPage from './pages/category';
import SearchPage from './pages/search';

import CartPage from './pages/cart';
import CheckoutPage from './pages/checkout';
import OrdersPage from './pages/orders';
import CategoriesPage from './pages/categories';
import NotFoundPage from './pages/NotFoundPage';
// import IconDemo from '@/pages/IconDemo';
import './i18n';
import './App.css';
import Home from './home';

import Layout from './layouts/Layouts';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStore } from './hooks/useStoreData';
import AccentColorSetter from './components/AccentColorSetter';
import { pixelTracker } from './lib/pixelTracking';
import { useEffect, useState } from 'react';
import { SUBDOMAIN } from './store';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			gcTime: 10 * 60 * 1000, // 10 minutes
			retry: process.env.NODE_ENV === 'production' ? 2 : 1,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			refetchOnWindowFocus: process.env.NODE_ENV === 'production',
		},
	},
});

function InnerApp() {
	const subdomain = SUBDOMAIN();
	const { storedData, loading, error } = useStore();
	const location = useLocation();
	const [pixelsInitialized, setPixelsInitialized] = useState(false);

	useEffect(() => {
		if (storedData?.settings?.pixel) {
			pixelTracker.initializePixels(storedData.settings.pixel).then(() => {
				setPixelsInitialized(true);
			});
		}
	}, [storedData]);

	useEffect(() => {
		if (pixelsInitialized && storedData?.settings?.pixel) {
			storedData.settings.pixel.forEach((pixel) => {
				pixelTracker.trackPageView(pixel.type, location.pathname);
			});
		}
	}, [location.pathname, storedData, pixelsInitialized]);

	if (subdomain === '' && process.env.NODE_ENV === 'production') {
		window.location.href = 'https://halakommers.com';
		return null;
	}

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error && process.env.NODE_ENV !== 'development') {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen p-4">
				<p className="text-lg mb-4">there is no store under subdomain {subdomain}</p>
				<button
					className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
					onClick={() =>
						(window.location.href = 'https://seller.boddasaad.me/dashboard/setting-store')
					}
				>
					Go to Dashboard
				</button>
			</div>
		);
	}

	return (
		<>
			<AccentColorSetter />
			<Layout>
				<Routes>
					<Route index element={<Home />} />
					<Route path="product/:id" element={<ProductPage />} />
					<Route path="categories" element={<CategoriesPage />} />
					<Route path="category/:id" element={<CategoryPage />} />
					<Route path="search" element={<SearchPage />} />

					<Route path="cart" element={<CartPage />} />
					<Route path="checkout" element={<CheckoutPage />} />
					<Route path="orders" element={<OrdersPage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</Layout>
		</>
	);
}

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<InnerApp />
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;
