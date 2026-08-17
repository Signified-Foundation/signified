import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@paper-design/shaders-react", "@paper-design/shaders"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
