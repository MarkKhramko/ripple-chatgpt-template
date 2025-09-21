import { defineConfig, loadEnv } from 'vite';
import { ripple } from 'vite-plugin-ripple';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '../../');

	return {
		plugins: [
			ripple(),
			tailwindcss()
		],
		resolve: {
			alias: {
				'#api':        path.resolve(__dirname, './src/api'),
				'#components': path.resolve(__dirname, './src/components'),
				'#events':     path.resolve(__dirname, './src/events'),
				'#hooks':      path.resolve(__dirname, './src/hooks'),
				'#icons':      path.resolve(__dirname, './src/components/icons'),
			},
		},
		server: {
			port: env.VITE_FRONTEND_PORT || 3000,
			proxy: {
				// Proxy all /api requests to backend
				'/api': {
					target: env.VITE_BACKEND_URL,
					changeOrigin: true,
					secure: false,
				},
			},
		},
		build: {
			target: 'esnext',
		},
	};
});
