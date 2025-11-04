const BASE_URL = 'https://boddasaad.me/api/';
const TIMEOUT_DURATION = 10000; // 10 seconds

export const api = {
	get: async (endpoint: string) => {
		// Use AbortController for timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

		try {
			const response = await fetch(`${BASE_URL}${endpoint}`, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			console.log('URL', BASE_URL + endpoint);

			if (!response.ok) {
				throw new Error(`API error: ${response.status} ${response.statusText}`);
			}

			const data = await response.json();
			return { data };
		} catch (error) {
			clearTimeout(timeoutId); // Clear the timeout if still active
			if (error instanceof Error && error.name === 'AbortError') {
				console.error('API request timeout:', error);
				throw new Error('Request timeout');
			}
			console.error('API error:', error);
			// Re-throw the error to be handled by calling code
			throw error instanceof Error ? error : new Error('Unknown error occurred');
		}
	},
	post: async (endpoint: string, body: unknown) => {
		// Use AbortController for timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

		try {
			const response = await fetch(`${BASE_URL}${endpoint}`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			console.log('URL', BASE_URL + endpoint);

			if (!response.ok) {
				throw new Error(`API error: ${response.status} ${response.statusText}`);
			}

			const data = await response.json();
			return { data };
		} catch (error) {
			clearTimeout(timeoutId); // Clear the timeout if still active
			if (error instanceof Error && error.name === 'AbortError') {
				console.error('API request timeout:', error);
				throw new Error('Request timeout');
			}
			console.error('API error:', error);
			// Re-throw the error to be handled by calling code
			throw error instanceof Error ? error : new Error('Unknown error occurred');
		}
	},
};
