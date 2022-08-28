/** @type {import('next').NextConfig} */

const path = require("path");
const withPlugins = require("next-compose-plugins");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    reactStrictMode: true,
  },
}

module.exports = nextConfig
module.exports = withPlugins([], nextConfig);