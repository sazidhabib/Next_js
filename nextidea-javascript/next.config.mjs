const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/portfolio',
        destination: '/protfolio',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'https://demo.nextideasolution.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
