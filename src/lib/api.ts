// Helper API universal untuk seluruh aplikasi
// Otomatis pakai base URL dari VITE_API_URL (Netlify/production) atau proxy (local dev)

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Helper universal untuk fetch ke backend
 * @param {string} path - path endpoint, contoh: '/api/auth/profile'
 * @param {RequestInit} options - opsi fetch (method, headers, body, dsb)
 * @returns {Promise<any>} - hasil response json
 * @throws {Error} - jika response tidak ok
 */
export async function apiFetch(path: string, options: RequestInit = {}) {
	const url = `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
	const res = await fetch(url, options);

	// Global error handling dasar
	if (!res.ok) {
		let errorMsg = 'API Error';
		try {
			const data = await res.json();
			errorMsg = data.message || errorMsg;
		} catch (e) {
			// Tidak ada response json, biarkan errorMsg default
		}
		throw new Error(errorMsg);
	}

	// Jika response kosong (204), return null
	if (res.status === 204) return null;
	return res.json();
}
