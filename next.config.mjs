/** @type {import('next').NextConfig} */

const nextConfig = async () => {
  const isDev = process.env.NODE_ENV === "development";

  return {
    ...(isDev ? { output: "export", outDir: "./out" }:{}),

    async rewrites() {
      if (isDev) {
        return [
          {
            source: "/api/:path*",
            destination: "http://localhost:8088/api/:path*",
          },
        ];
      }else{
        return []
      }
    },
  };
};
export default nextConfig;
