/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NEXT_PUBLIC_BASE_PATH ? { basePath: process.env.NEXT_PUBLIC_BASE_PATH } : {}),
  reactCompiler: true,
  serverExternalPackages: ["sequelize", "mysql2"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

