/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactCompiler: true,
  serverExternalPackages: ['sequelize', 'mysql2', 'bcryptjs'],
};

export default nextConfig;
