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
    rewrites,
    // outDir: './out'
};

export default nextConfig;
