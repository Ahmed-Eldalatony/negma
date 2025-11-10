interface Pixel {
	id: string;
	type: string;
}

declare global {
	interface Window {
		ttq?: {
			load: (id: string) => void;
			track: (event: string, params?: Record<string, unknown>) => void;
			page: () => void;
		};
		fbq?: (command: string, ...args: unknown[]) => void;
		gtag?: (command: string, targetId: string, config?: Record<string, unknown>) => void;
	}
}

class PixelTracker {
	private initializedPixels: Set<string> = new Set();
	private pixelTypes: Map<string, string> = new Map();

	private isTrackingAllowed(): boolean {
		if (typeof window === 'undefined') return false;
		// Allow tracking in development without explicit consent
		if (process.env.NODE_ENV === 'development') return true;
		const consent = localStorage.getItem('pixel-consent');
		return consent === null ? true : consent === 'true'; // default to true if no consent is set
	}

	async initializePixels(pixels: Pixel[]) {
		if (!this.isTrackingAllowed()) return;
		for (const pixel of pixels) {
			if (this.initializedPixels.has(pixel.id)) continue;
			console.log(`Initializing ${pixel.type} pixel with ID: ${pixel.id}`);
			try {
				await this.loadPixelScript(pixel);
				this.initializePixel(pixel);
				this.initializedPixels.add(pixel.id);
				this.pixelTypes.set(pixel.id, pixel.type);
			} catch (error) {
				console.error(`Failed to initialize ${pixel.type} pixel ${pixel.id}:`, error);
			}
		}
	}

	private async loadPixelScript(pixel: Pixel): Promise<void> {
		return new Promise((resolve, reject) => {
			if (document.querySelector(`script[data-pixel-id="${pixel.id}"]`)) {
				resolve();
				return;
			}

			const script = document.createElement('script');
			script.setAttribute('data-pixel-id', pixel.id);

			switch (pixel.type) {
				case 'tiktok':
					if (window.ttq) {
						resolve();
						return;
					}
					console.log(`Loading TikTok pixel script for ID: ${pixel.id}`);
					script.src = 'https://analytics.tiktok.com/i18n/pixel/events.js';
					script.async = true;
					script.onload = () => {
						console.log('TikTok pixel script loaded successfully.');
						resolve();
					};
					script.onerror = () => {
						console.error('TikTok pixel script failed to load.');
						reject(new Error('TikTok pixel script failed to load.'));
					};
					break;
				case 'facebook':
					script.innerHTML = `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
          `;
					resolve();
					break;
				case 'google':
					script.src = 'https://www.googletagmanager.com/gtag/js?id=' + pixel.id;
					script.onload = () => resolve();
					script.onerror = () => reject(new Error('Google Analytics script load failed'));
					break;
				default:
					reject(new Error(`Unsupported pixel type: ${pixel.type}`));
					return;
			}

			if (script.src || script.innerHTML) {
				document.head.appendChild(script);
			}
		});
	}

	trackEvent(pixelType: string, event: string, parameters: Record<string, unknown> = {}) {
		switch (pixelType) {
			case 'tiktok':
				if (window.ttq) {
					console.log(`Tracking TikTok event: ${event}`, parameters);
					window.ttq.track(event, parameters);
				}
				break;
			case 'facebook':
				if (window.fbq) {
					window.fbq('track', event, parameters);
				}
				break;
			case 'google':
				if (window.gtag) {
					window.gtag('event', event, parameters);
				}
				break;
		}
	}

	trackPageView(pixelType: string, page: string) {
		this.trackEvent(pixelType, 'PageView', { page_path: page });
	}

	private initializePixel(pixel: Pixel) {
		switch (pixel.type) {
			case 'tiktok': {
				// Use hardcoded TikTok pixel ID
				const tikTokId = 'D1EVISJC77U9800H711G';
				// Wait for ttq to be available
				const checkTtq = () => {
					if (window.ttq) {
						// Validate pixel ID format
						if (!tikTokId || tikTokId.length !== 20 || !/^[A-Z][A-Z0-9]{19}$/.test(tikTokId)) {
							console.error('Invalid TikTok Pixel ID format:', tikTokId);
							return;
						}

						console.log('Initializing TikTok Pixel with ID:', tikTokId);
						window.ttq.load(tikTokId);
						window.ttq.page();
					} else {
						setTimeout(checkTtq, 100);
					}
				};

				checkTtq();
				break;
			}
			case 'facebook':
				if (window.fbq && pixel.id) {
					window.fbq('init', pixel.id);
				}
				break;
			case 'google':
				if (window.gtag && pixel.id) {
					window.gtag('config', pixel.id);
				}
				break;
		}
	}

	trackPurchase(pixelType: string, value: number, currency: string, contentIds: string[]) {
		const parameters = {
			value,
			currency,
			content_ids: contentIds,
			content_type: 'product',
		};

		switch (pixelType) {
			case 'tiktok':
				this.trackEvent(pixelType, 'CompletePayment', parameters);
				break;
			case 'facebook':
				this.trackEvent(pixelType, 'Purchase', parameters);
				break;
			case 'google':
				this.trackEvent(pixelType, 'purchase', {
					...parameters,
					transaction_id: Date.now().toString(),
				});
				break;
		}
	}

	trackPurchaseForAll(value: number, currency: string, contentIds: string[]) {
		if (!this.isTrackingAllowed()) return;
		this.pixelTypes.forEach((type) => {
			this.trackPurchase(type, value, currency, contentIds);
		});
	}

	trackEventForAll(event: string, parameters: Record<string, unknown> = {}) {
		if (!this.isTrackingAllowed()) return;
		this.pixelTypes.forEach((type) => {
			this.trackEvent(type, event, parameters);
		});
	}
}

export const pixelTracker = new PixelTracker();
