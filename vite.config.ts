import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	server: {
		host: '::',
		port: 8080,
		proxy: {
			// untuk development:
			// '/api': 'http://localhost:5000',
			// untuk production:
			'/api': process.env.VITE_API_URL,
		},
	},
	plugins: [react(), mode === 'development' && componentTagger()].filter(Boolean),
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
}));
