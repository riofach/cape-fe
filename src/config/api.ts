// Untuk development:
// export const API_BASE_URL = 'http://localhost:5000/api';

// Untuk production:
// export const API_BASE_URL = 'https://cape-be.up.railway.app/api';

export const API_BASE_URL = import.meta.env.VITE_API_URL + '/api';
