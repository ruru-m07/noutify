/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@noutify/ui"],
  experimental: {
    useCache: true,
    nodeMiddleware: true,
  },
};

export default nextConfig;
