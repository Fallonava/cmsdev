import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow local IP access during development
  allowedDevOrigins: ["192.168.1.10"],
  images: {
    remotePatterns: [
      // Unsplash
      { protocol: "https", hostname: "images.unsplash.com" },
      // Google Drive / Photos
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "drive.google.com" },
      // Imgur
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "imgur.com" },
      // iCloud & CDN umum
      { protocol: "https", hostname: "**.cloudinary.com" },
      // Pexels / Pixabay
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "pixabay.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      // Catch-all untuk semua HTTPS (fleksibel, cocok untuk CMS)
      { protocol: "https", hostname: "**" },
    ],
  },
  transpilePackages: ['lucide-react'],
} as any;

export default nextConfig;
