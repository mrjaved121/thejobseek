import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      // Force the bare domain (no www) so Google sees one canonical host.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.thejobseek.com" }],
        destination: "https://thejobseek.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
