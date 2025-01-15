/** @type {import('next').NextConfig} */

const nextConfig = async () => {
  const isDev = process.env.NODE_ENV === "development";

  return {
    // 在开发模式下关闭 'export' 和 'outDir'
    ...(isDev ? {} : { output: "export", outDir: "./out" }),

    // 根据环境动态设置 rewrites
    async rewrites() {
      if (isDev) {
        return [];
      }

      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:8088/api/:path*",
        },
      ];
    },
  };
};
export default nextConfig;
