import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import path from "path";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  transpilePackages: ["@noutify/ui"],
  output: "standalone",
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
  outputFileTracingRoot: path.join(__dirname, "./"),
  outputFileTracingIncludes: {
    "*": ["public/**/*", ".next/static/**/*"],
  },
};

// @ts-expect-error - // ? well some type issue bcuz we are in canary channel.
export default withBundleAnalyzer(nextConfig);
