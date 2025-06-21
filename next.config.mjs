/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable standalone mode for containerized deployment
  output: "standalone",
  // Optimize for production
  compress: true,
  // Enable image optimization for production
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
