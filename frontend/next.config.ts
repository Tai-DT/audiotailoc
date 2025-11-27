import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack disabled - using webpack instead due to compatibility issues
  
  // Enable TypeScript strict checking for type safety
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog', 
      '@radix-ui/react-aspect-ratio',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-hover-card',
      '@radix-ui/react-label',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      'lucide-react',
      'react-hook-form',
      'framer-motion'
    ],
  },
  
  // Webpack optimizations removed to avoid Turbopack conflicts
  // webpack: (config, { dev, isServer }) => {
  //   // Optimize bundle size in production
  //   if (!dev && !isServer) {
  //     config.optimization = {
  //       ...config.optimization,
  //       usedExports: true,
  //       sideEffects: false,
  //     };
  //   }
  //   
  //   return config;
  // },
  
  // Custom domain configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Remove turbopack config to avoid conflict with outputFileTracingRoot
  async rewrites() {
    // Only use rewrites in development to proxy API requests to backend
    if (process.env.NODE_ENV === 'development') {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';
      // Remove /api/v1 suffix if present to get base backend URL
      const backendBase = backendUrl.replace(/\/api\/v1\/?$/, '');
      return [
        {
          source: '/api/v1/:path*',
          destination: `${backendBase}/api/v1/:path*`,
        },
      ];
    }
    return [];
  },
  
  // Optimize for production builds
  serverExternalPackages: ['axios'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
};

export default nextConfig;
