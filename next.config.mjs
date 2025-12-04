/** @type {import('next').NextConfig} */
const rewrites = () => {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8088/api/:path*",
      },
    ];
  };
const nextConfig = {
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    output: 'export',
    // rewrites
};

export default nextConfig;
