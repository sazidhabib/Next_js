/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['sequelize', 'mysql2', 'sharp'],
};

export default nextConfig;
