/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,ripple}'],
	theme: {
		extend: {},
	},
	plugins: [
		plugin(function ({ addUtilities }) {
			addUtilities({
				'.scrollbar-gutter-auto': {
					'scrollbar-gutter': 'auto',
				},
				'.scrollbar-gutter-stable': {
					'scrollbar-gutter': 'stable',
				},
				'.scrollbar-gutter-stable-both-edges': {
					'scrollbar-gutter': 'stable both-edges',
				},
			});
		}),
	],
};
