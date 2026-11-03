/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['sequelize', 'mysql2'],
};

export default nextConfig;
