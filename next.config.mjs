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
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    output: 'export',
    outDir: './out',
    rewrites
};

export default nextConfig;
