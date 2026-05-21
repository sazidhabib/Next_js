/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sequelize'],
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:5000/api/auth/:path*',
      },
      {
        source: '/api/settings/:path*',
        destination: 'http://localhost:5000/api/settings/:path*',
      },
      {
        source: '/api/categories/:path*',
        destination: 'http://localhost:5000/api/categories/:path*',
      },
      {
        source: '/api/products/:path*',
        destination: 'http://localhost:5000/api/products/:path*',
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        net: false,
        tls: false,
        pg: false,
        'pg-native': false,
        dns: false,
        child_process: false,
      };
    }
    return config;
  },
};

export default nextConfig;
