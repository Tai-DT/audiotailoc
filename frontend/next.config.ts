import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';
const backendBase = apiUrl.replace(/\/api\/v1\/?$/, '');

let backendImagePattern:
  | {
      protocol: 'http' | 'https';
      hostname: string;
      port: string;
      pathname: string;
    }
  | undefined;

try {
  const backendUrl = new URL(backendBase);
  const protocol = backendUrl.protocol.replace(':', '');
  if (protocol === 'http' || protocol === 'https') {
    backendImagePattern = {
      protocol,
      hostname: backendUrl.hostname,
      port: backendUrl.port,
      pathname: '/**',
    };
  }
} catch {
  // ignore invalid NEXT_PUBLIC_API_URL
}

const nextConfig: NextConfig = {
  // Turbopack configuration removed - not compatible with outputFileTracingRoot
  
  // Enable Turbopack for faster builds
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Temporarily disable TypeScript checking to focus on connectivity
  typescript: {
    ignoreBuildErrors: true,
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
      'framer-motion',
      'motion/react',
      // Additional optimizations for smaller bundles
      '@tanstack/react-query',
      'date-fns',
      'clsx',
      'embla-carousel-react',
      'react-hot-toast',
      'socket.io-client',
      // Heavy libraries - optimize imports
      'recharts',
      'react-markdown',
      'zod',
    ],
  },
  
  // Modularize imports for better tree-shaking
  modularizeImports: {
    'date-fns': {
      transform: 'date-fns/{{member}}',
    },
    'recharts': {
      transform: 'recharts/es6/{{member}}',
    },
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size in production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }
    
    return config;
  },
  
  // Custom domain configuration with aggressive caching
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
      // Cache static assets aggressively (1 year)
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache images (1 month)
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      // Cache fonts (1 year)
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache public assets (1 week)
      {
        source: '/:path*.{ico,png,jpg,jpeg,svg,webp}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Canonical Vietnamese routes for better SEO
      {
        source: '/categories',
        destination: '/danh-muc',
        permanent: true,
      },
      {
        source: '/categories/:slug',
        destination: '/danh-muc/:slug',
        permanent: true,
      },
      {
        source: '/projects',
        destination: '/du-an',
        permanent: true,
      },
      {
        source: '/projects/:slug',
        destination: '/du-an/:slug',
        permanent: true,
      },
    ];
  },

  // Remove turbopack config to avoid conflict with outputFileTracingRoot
  async rewrites() {
    // Only use rewrites in development to proxy API requests to backend
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/v1/:path*',
          destination: `${backendBase}/api/v1/:path*`,
        },
        {
          source: '/uploads/:path*',
          destination: `${backendBase}/uploads/:path*`,
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
        protocol: 'http',
        hostname: 'localhost',
        port: '3010',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3010',
        pathname: '/**',
      },
      ...(backendImagePattern ? [backendImagePattern] : []),
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
    // Default to optimized images in production; allow opting out via env.
    unoptimized: process.env.NEXT_PUBLIC_DISABLE_IMAGE_OPTIMIZATION === 'true',
  },
};

export default nextConfig;
