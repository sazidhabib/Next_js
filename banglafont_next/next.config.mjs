/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/next-type",
  reactCompiler: true,
  output: "standalone",
  serverExternalPackages: ["sequelize", "mysql2"],
};

export default nextConfig;
