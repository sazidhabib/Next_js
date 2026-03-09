const nextConfig = {
  // output: 'standalone', // Not needed for custom server, causes warnings with 'npm start'
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'presidentpropertiesltd.com',
      },
      {
        protocol: 'https',
        hostname: 'president.deshprobaho.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      }
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://presidentpropertiesltd.com https://www.presidentpropertiesltd.com https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://presidentpropertiesltd.com https://www.presidentpropertiesltd.com https://president.deshprobaho.com; frame-src 'self' https://www.google.com https://www.youtube.com https://youtube.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
