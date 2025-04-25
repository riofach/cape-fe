import { API_BASE_URL } from '../config/api';

export async function apiRequest(
	endpoint: string,
	options: RequestInit = {},
	withAuth: boolean = false
) {
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		...(options.headers || {}),
	};

	// Tambahkan Authorization jika withAuth true dan ada token
	if (withAuth) {
		const token = sessionStorage.getItem('token');
		if (token) headers['Authorization'] = `Bearer ${token}`;
	}

	const res = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers,
	});
	const data = await res.json();
	if (!res.ok) {
		// Global auto logout jika session expired (force_logout)
		if (
			(res.status === 401 || res.status === 403) &&
			data?.message?.toLowerCase().includes('session expired')
		) {
			sessionStorage.clear();
			window.location.href = '/login';
		}
		throw data;
	}
	return data;
}
