/** @type {import('next').NextConfig} */

const path = require('path');
const withPlugins = require('next-compose-plugins');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
    reactStrictMode: true,
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
    return config;
  },
};

module.exports = withPlugins([], nextConfig);
