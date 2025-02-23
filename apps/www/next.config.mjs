/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@noutify/ui"],
  experimental: {
    useCache: true,
  },
};

export default nextConfig;
