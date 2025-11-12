import { useEffect } from 'react';

interface MetadataOptions {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
	favicon?: string;
}

export const useMetadata = (options: MetadataOptions) => {
	useEffect(() => {
		// Update title
		if (options.title) {
			document.title = options.title;
		}

		// Update or create meta description
		let descriptionMeta = document.querySelector('meta[name="description"]');
		if (!descriptionMeta) {
			descriptionMeta = document.createElement('meta');
			descriptionMeta.setAttribute('name', 'description');
			document.head.appendChild(descriptionMeta);
		}
		if (options.description) {
			descriptionMeta.setAttribute('content', options.description);
		}

		// Update or create Open Graph meta tags
		const updateMeta = (property: string, content: string) => {
			let meta = document.querySelector(`meta[property="${property}"]`);
			if (!meta) {
				meta = document.createElement('meta');
				meta.setAttribute('property', property);
				document.head.appendChild(meta);
			}
			meta.setAttribute('content', content);
		};

		if (options.title) updateMeta('og:title', options.title);
		if (options.description) updateMeta('og:description', options.description);
		if (options.image) updateMeta('og:image', options.image);
		if (options.url) updateMeta('og:url', options.url);

		// Update favicon
		if (options.favicon) {
			let favicon = document.querySelector('link[rel="icon"]');
			if (!favicon) {
				favicon = document.createElement('link');
				favicon.setAttribute('rel', 'icon');
				document.head.appendChild(favicon);
			}
			favicon.setAttribute('href', options.favicon);
		}

		// Cleanup function to reset to defaults when component unmounts
		return () => {
			// Reset title to default
			document.title = 'Vite + React + TS';

			// Remove dynamic meta tags
			const metas = document.querySelectorAll('meta[property^="og:"]');
			metas.forEach((meta) => meta.remove());

			// Reset favicon to default
			const favicon = document.querySelector('link[rel="icon"]');
			if (favicon) {
				favicon.setAttribute('href', '/vite.svg');
			}
		};
	}, [options.title, options.description, options.image, options.url, options.favicon]);
};
