// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn2.thedogapi.com',
      },
    ],
  },
  // Remove the experimental.serverActions option
};

export default nextConfig;
