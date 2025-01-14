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
    // output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    rewrites,
    // outDir: './out'
};

export default nextConfig;
