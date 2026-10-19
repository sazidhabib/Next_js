/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kamrulhasan.info',
      },
      {
        protocol: 'https',
        hostname: '*.kamrulhasan.info',
      },
      {
        protocol: 'https',
        hostname: 'pathokbonddhu.kamrulhasan.info',
      },
      {
        protocol: 'http',
        hostname: 'pathokbonddhu.kamrulhasan.info',
      },
      {
        protocol: 'https',
        hostname: 'pathakbondhu.com',
      },
      {
        protocol: 'https',
        hostname: 'www.pathakbondhu.com',
      },
      {
        protocol: 'https',
        hostname: '*.pathakbondhu.com',
      },
      {
        protocol: 'http',
        hostname: 'pathakbondhu.com',
      },
      {
        protocol: 'http',
        hostname: 'www.pathakbondhu.com',
      },
      {
        protocol: 'http',
        hostname: '*.pathakbondhu.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  serverExternalPackages: ['mysql2', 'sequelize', 'bcryptjs'],
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    return {
      beforeFiles: [
        {
          source: '/uploads/:path*',
          destination: `${backendUrl}/uploads/:path*`,
        },
        {
          source: '/images/:path*',
          destination: `${backendUrl}/images/:path*`,
        },
      ],
      fallback: [
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
