import type { NextConfig } from "next";

// Static export: `npm run build` writes the whole site as plain files to ./out
// (host on DigitalOcean App Platform as a Static Site, output directory "out").
// trailingSlash makes every page a folder with index.html (/uae/article/ ),
// which static hosts serve without ".html" in the URL.
// The www → thejobseek.com redirect is set at the host/DNS level (see README).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
