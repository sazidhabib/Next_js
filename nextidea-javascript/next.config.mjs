const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
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
};

export default nextConfig;
