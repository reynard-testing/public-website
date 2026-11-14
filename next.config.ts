import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.glsl": {
        type: "text",
      },
      // `import source from "./file.ts?inline"` gives the file compiled to a JS string, for inline <script>s
      "*.ts": {
        condition: { query: "?inline" },
        loaders: [
          {
            loader: "esbuild-loader",
            options: { loader: "ts", format: "iife", minify: true },
          },
        ],
        type: "text",
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
