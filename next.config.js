/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    eslint: {
        // Ignore ESLint errors during production builds
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
