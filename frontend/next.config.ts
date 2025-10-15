import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aibe3-team4-bucket-1.s3.ap-northeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
