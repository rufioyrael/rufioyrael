import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Keep Turbopack rooted in this app workspace when multiple lockfiles exist nearby.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
