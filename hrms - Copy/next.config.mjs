/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactCompiler: true,
  poweredByHeader: false,
  serverExternalPackages: ['sequelize', 'mysql2', 'bcryptjs'],
};

export default nextConfig;
