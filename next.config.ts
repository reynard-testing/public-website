import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      "*.glsl": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
      "*.svg": {
        // svgo would strip viewBox and <style> rules from our SVGs, breaking them
        loaders: [{ loader: "@svgr/webpack", options: { svgo: false } }],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
