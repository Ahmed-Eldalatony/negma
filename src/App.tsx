import { BrowserRouter, Routes, Route } from 'react-router';
// import { Bsdge } from '@/components/ui/badge';
// // import { useCounterStore } from './store';
// // import { useTranslation } from 'react-i18next';
import ProductPage from './pages/product';
import CategoryPage from './pages/category';
import FavoritesPage from './pages/favorites';
import CartPage from './pages/cart';
import CategoriesPage from './pages/categories';
// import IconDemo from '@/pages/IconDemo';
import './i18n';
import './App.css';
import Home from './home';

import Layout from './layouts/Layouts';
import { ThemeProvider } from './context/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStore } from './hooks/useStoreData';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      retry: process.env.NODE_ENV === 'production' ? 2 : 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: process.env.NODE_ENV === 'production',
    },
  },
});

function InnerApp() {
	useStore();

	return (
		<BrowserRouter>
			<ThemeProvider>
				<Layout>
					<Routes>
						<Route index element={<Home />} />
						<Route path="product/:id" element={<ProductPage />} />
						<Route path="categories" element={<CategoriesPage />} />
						<Route path="category/:id" element={<CategoryPage />} />
						<Route path="favorites" element={<FavoritesPage />} />
						<Route path="cart" element={<CartPage />} />
					</Routes>
				</Layout>
			</ThemeProvider>
		</BrowserRouter>
	);
}

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<InnerApp />
		</QueryClientProvider>
	);
}

export default App;
