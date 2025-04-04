import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

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
    turbo: {
      memoryLimit: 2048,
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
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

// @ts-expect-error - // ? well some type issue bcuz we are in canary channel.
export default withBundleAnalyzer(nextConfig);
