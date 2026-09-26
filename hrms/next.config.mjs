/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['sequelize', 'mysql2', 'bcryptjs'],
};

export default nextConfig;
