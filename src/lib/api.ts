const BASE_URL = 'https://boddasaad.me/api/';

export const api = {
	get: async (endpoint: string) => {
		try {
			const response = await fetch(`${BASE_URL}${endpoint}`);
			console.log('URL', BASE_URL + endpoint);
			console.log('Response status:', response.status);

			if (!response.ok) {
				throw new Error(`API error: ${response.status} ${response.statusText}`);
			}

			const data = await response.json();
			return { data };
		} catch (error) {
			console.error('API error:', error);
			throw error;
		}
	},
};
