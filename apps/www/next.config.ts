import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  transpilePackages: ["@noutify/ui"],
  // TODO(ruru-m07): Implement standalone output configuration for desctop builds.
  // output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    useCache: true,
    nodeMiddleware: true,
    parallelServerBuildTraces: true,
    webpackBuildWorker: true,
    nextScriptWorkers: true,
    viewTransition: true,
    reactCompiler: true,
    ppr: true,
  },
  // TODO: will make a seprate build for the server and client.
  // cacheMaxMemorySize: 0,
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
