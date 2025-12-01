import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Silence Turbopack warning (we're using webpack config)
  turbopack: {},

  // Remove console logs in production (keep warnings/errors)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Experimental optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'three', '@react-three/fiber', '@react-three/drei'],
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Only modify client-side bundle
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxSize: 244 * 1024, // 244KB max chunk size to prevent blocking
        minSize: 20 * 1024,  // 20KB min chunk size to prevent over-splitting
        cacheGroups: {
          default: false,
          vendors: false,
          // Three.js separate chunk (async loading for on-demand)
          three: {
            name: 'three',
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            chunks: 'async', // Changed to async for on-demand loading
            priority: 30,
            maxSize: 244 * 1024,
          },
          // Framer Motion chunk
          framerMotion: {
            name: 'framer',
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            chunks: 'all',
            priority: 25,
            maxSize: 244 * 1024,
          },
          // Vendor chunk (remaining node_modules)
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 20,
            maxSize: 244 * 1024,
          },
          // Common app code
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            maxSize: 244 * 1024,
          },
        },
      };

      // Add runtime chunk for better caching
      config.optimization.runtimeChunk = 'single';
    }

    return config;
  },

  // HTTP caching headers for static assets
  async headers() {
    return [
      {
        source: '/assets/optimized/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*.(jpg|jpeg|png|webp|avif|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
