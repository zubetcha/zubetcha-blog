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
				source: '/category/:category',
				destination: '/category/:category/1',
			},
		];
	},
	webpack(config, { webpack }) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		});
		config.resolve.fallback = { fs: false };
		return config;
	},
};

module.exports = withPlugins([], nextConfig);
