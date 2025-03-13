import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@noutify/ui"],
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    useCache: true,
    nodeMiddleware: true,
    parallelServerBuildTraces: true,
    webpackBuildWorker: true,
    memoryBasedWorkersCount: true,
    nextScriptWorkers: true,
    viewTransition: true,
    reactCompiler: true,
  },
  // compiler: {
  //   removeConsole: true,
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
