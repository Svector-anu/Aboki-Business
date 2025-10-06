// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   images: {
      domains: ["localhost"],
      formats: ["image/webp", "image/avif"],
   },
   experimental: {
      ...(process.env.NODE_ENV === "production" && {
         optimizeCss: true,
      }),
   },
   webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      if (!dev && !isServer) {
         config.optimization = {
            ...config.optimization,
            splitChunks: {
               ...config.optimization.splitChunks,
               cacheGroups: {
                  ...config.optimization.splitChunks.cacheGroups,
                  styles: {
                     name: "styles",
                     test: /\.(css|scss|sass)$/,
                     chunks: "all",
                     enforce: true,
                  },
               },
            },
         };
      }
      return config;
   },
   async headers() {
      return [
         {
            source: "/(.*)",
            headers: [
               {
                  key: "X-Frame-Options",
                  value: "ALLOW-FROM https://warpcast.com",
               },
               {
                  key: "Content-Security-Policy",
                  value: "frame-ancestors 'self' https://warpcast.com https://*.farcaster.xyz",
               },
               {
                  key: "X-Content-Type-Options",
                  value: "nosniff",
               },
               {
                  key: "Referrer-Policy",
                  value: "origin-when-cross-origin",
               },
               {
                  key: "X-XSS-Protection",
                  value: "1; mode=block",
               },
            ],
         },
      ];
   },
   onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
   },
};

export default nextConfig;