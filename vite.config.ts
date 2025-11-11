import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		allowedHosts: ['*.halastore.net', 'halastore.net'],
		proxy: {
			'/api': {
				target: 'https://halastore.net',
				changeOrigin: true,
				secure: true,
			},
		},
	},
	preview: {
		allowedHosts: ['*.halastore.net', 'halastore.net'],
	},
});
