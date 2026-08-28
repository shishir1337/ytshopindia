import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Brotli/gzip for HTML + RSC payloads served by `next start`
  compress: true,
  poweredByHeader: false,

  images: {
    // AVIF first (smallest), WebP fallback. Cuts the 800x800 JPEG avatars
    // down to the size they are actually displayed at.
    formats: ["image/avif", "image/webp"],
    // Uploaded files have timestamped names and YouTube thumbnails are stable,
    // so optimized variants can be cached for a long time (30 days).
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },

  experimental: {
    // Inlines the page's CSS into the HTML document, removing the two
    // render-blocking stylesheet requests (~450ms on mobile).
    inlineCss: true,
    // Keeps barrel-file icon packages from pulling thousands of modules
    // into the client bundle.
    optimizePackageImports: ["lucide-react", "@tabler/icons-react"],
  },

  async headers() {
    return [
      {
        // Files in /public are served with `max-age=0` by default, forcing a
        // revalidation round-trip on every visit. Uploads are immutable
        // (timestamped filenames), so they can be cached forever.
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:file*.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
