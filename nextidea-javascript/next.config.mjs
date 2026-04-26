const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
      },
      {
        protocol: "https",
        hostname: "geekysocial.com",
      },
      {
        protocol: "https",
        hostname: "nextideasolution.com",
      },
      {
        protocol: "https",
        hostname: "www.nextideasolution.com",
      },
    ],
  },
  serverExternalPackages: ['mysql2'],
  // Reduce memory usage during build
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  // Disable source maps in production to save memory
  productionBrowserSourceMaps: false,
  // Compress responses
  compress: true,
};

export default nextConfig;
