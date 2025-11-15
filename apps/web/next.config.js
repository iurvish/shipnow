/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "gwatgzypdlugafnvvttt.supabase.co",
      },

      {
        protocol: "https",
        hostname: "organic-haddock-7199.upstash.io",
      },
    ],
  },
};

export default nextConfig;
