/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/next-type",
  reactCompiler: true,
  serverExternalPackages: ["sequelize", "mysql2"],
};

export default nextConfig;

