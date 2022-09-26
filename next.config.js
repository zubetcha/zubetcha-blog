/** @type {import('next').NextConfig} */

const path = require('path');
const withPlugins = require('next-compose-plugins');

const nextConfig = {
	trailingSlash: false,
	reactStrictMode: true,
	swcMinify: true,
	sassOptions: {
		includePaths: [path.join(__dirname, 'src/styles')],
		reactStrictMode: true,
	},
	async rewrites() {
		return [
			{
				source: '/',
				destination: '/1',
			},
			{
				source: '/category/:category',
				destination: '/category/:category/1',
			},
		];
	},
	webpack(config, { webpack }) {
		config.resolve = {
			alias: {
				'@assets': path.resolve(__dirname, 'src/assets'),
				'@components': path.resolve(__dirname, 'src/components'),
				'@constants': path.resolve(__dirname, 'src/constants'),
				'@hooks': path.resolve(__dirname, 'src/hooks'),
				'@styles': path.resolve(__dirname, 'src/styles'),
				'@utils': path.resolve(__dirname, 'src/utils'),
			},
			...config.resolve,
		};
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		});
		return config;
	},
};

module.exports = withPlugins([], nextConfig);
