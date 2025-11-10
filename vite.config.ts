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
		proxy: {
			'/api': {
				target: 'https://hwm.halastore.net',
				changeOrigin: true,
				secure: true,
			},
		},
	},
	preview: {
		allowedHosts: ['hwm.halastore.net'],
	},
});
