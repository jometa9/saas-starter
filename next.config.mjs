/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true
  },
  eslint: {
    // Deshabilitamos la verificación de ESLint durante la compilación
    ignoreDuringBuilds: true
  },
  typescript: {
    // Deshabilitamos la verificación de TypeScript durante la compilación
    ignoreBuildErrors: true
  }
};

export default nextConfig;
