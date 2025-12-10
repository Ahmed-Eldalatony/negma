interface Pixel {
	id: string;
	type: string;
}

// Extend Window interface to include the vendor specific objects
declare global {
	interface Window {
		ttq?: any; // typed as 'any' to allow the flexible stub definition
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
		return consent === null ? true : consent === 'true';
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
			// Check if a script tag with this ID already exists in the DOM
			if (document.querySelector(`script[data-pixel-id="${pixel.id}"]`)) {
				resolve();
				return;
			}

			const script = document.createElement('script');
			script.setAttribute('data-pixel-id', pixel.id);

			switch (pixel.type) {
				case 'tiktok':
					// [LOG 1] Check current state
					console.log('[1] Start loadPixelScript. value of window.ttq is:', window.ttq);

					// If it exists, we stop here.
					if (window.ttq) {
						console.log('TikTok pixel script already loaded. Resolving immediately.');
						resolve();
						return;
					}

					console.log('window.ttq is undefined. Creating Stub now...');

					// ============================================================
					// MANUALLY DEFINE TIKTOK STUB
					// ============================================================
					(window as any).ttq = (window as any).ttq || [];
					const ttq = (window as any).ttq;

					ttq.methods = [
						'page',
						'track',
						'identify',
						'instances',
						'debug',
						'on',
						'off',
						'once',
						'ready',
						'alias',
						'group',
						'enableCookie',
						'disableCookie',
					];

					ttq.setAndDefer = function (t: any, e: any) {
						t[e] = function () {
							t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
						};
					};

					for (let i = 0; i < ttq.methods.length; i++) {
						ttq.setAndDefer(ttq, ttq.methods[i]);
					}

					ttq.instance = function (t: any) {
						for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
							ttq.setAndDefer(e, ttq.methods[n]);
						return e;
					};

					ttq.load = function (e: any, n: any) {
						ttq._i = ttq._i || {};
						ttq._i[e] = [];
						ttq._i[e]._u = 'https://analytics.tiktok.com/i18n/pixel/events.js';
						ttq._t = ttq._t || {};
						ttq._t[e] = +new Date();
						ttq._o = ttq._o || {};
						ttq._o[e] = n || {};
					};
					// ============================================================

					// [LOG 2] Verify state after creation
					console.log('[2] Stub created successfully. window.ttq is now:', window.ttq);

					console.log(`Loading TikTok external script for ID: ${pixel.id}`);
					script.src = 'https://analytics.tiktok.com/i18n/pixel/events.js';
					script.async = true;
					script.onload = () => {
						console.log('[3] External TikTok script loaded from network.');
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
				// Because we defined the stub in loadPixelScript, window.ttq is guaranteed to exist now.
				if (window.ttq) {
					const tikTokId = pixel.id; // Use the dynamic ID passed to the function

					// Validate pixel ID format
					if (!tikTokId || tikTokId.length !== 20 || !/^[A-Z0-9]{20}$/.test(tikTokId)) {
						// Adjusted regex slightly to be standard alphanumeric,
						// your original was /^[A-Z][A-Z0-9]{19}$/ which is also fine.
						console.warn('Potential invalid TikTok Pixel ID format:', tikTokId);
						// We do not return here to allow testing, but you can uncomment return if strict.
					}

					console.log('Initializing TikTok Pixel with ID:', tikTokId);
					window.ttq.load(tikTokId);
					window.ttq.page();
				}
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
