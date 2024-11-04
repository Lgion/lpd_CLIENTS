// next.config.mjs
import withSourceMaps from '@zeit/next-source-maps';

/** @type {import('next').NextConfig} */
const nextConfig = withSourceMaps({
    reactStrictMode: true,
    swcMinify: true,
    productionBrowserSourceMaps: true,
});

export default nextConfig;