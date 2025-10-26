const BASE_URL = 'boddasaad.me/api/';

export const api = {
	get: async (endpoint: string) => {
		const res = await fetch(`${BASE_URL}${endpoint}`);
		if (!res.ok) throw new Error('API error');
		return res.json();
	},
};
