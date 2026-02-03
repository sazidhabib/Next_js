/** @type {import('next').NextConfig} */
const nextConfig = {
  /*
   * Rewrites are not needed since server.js handles API and Uploads routing
   * before passing requests to Next.js.
   */
  images: {
    unoptimized: process.env.NODE_ENV !== 'production',
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '5000',
      },
      {
        protocol: 'https',
        hostname: 'card.deshprobaho.com',
      },
    ],
  },
};

export default nextConfig;
