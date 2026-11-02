import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Admin uploads are stored on Cloudinary and their URLs are saved in
    // PostgreSQL. Permit those remote image URLs in Next/Image components.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
