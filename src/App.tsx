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

function App() {
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

export default App;
