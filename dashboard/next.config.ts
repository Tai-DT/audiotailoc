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
  // Performance optimizations
  compress: true, // Enable compression
  poweredByHeader: false, // Remove X-Powered-By header for security

  // Optimize production builds
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundle

  // Image optimization
  async headers() {
    const headers = [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
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

    // Only apply X-Frame-Options in production to allow dev tools
    if (process.env.NODE_ENV === 'production') {
      headers[0].headers.push({
        key: 'X-Frame-Options',
        value: 'DENY',
      });
    }

    return headers;
  },
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
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
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
      {
        protocol: 'https',
        hostname: 'phuctruongaudio.vn',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    // Disable optimization in development to prevent timeouts or 400 errors with local/remote images
    unoptimized: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DISABLE_IMAGE_OPTIMIZATION === 'true',
    formats: ['image/avif', 'image/webp'], // Use modern image formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Enable tree shaking
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }

    return config;
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', '@radix-ui/react-icons'],
  },
  turbopack: {},
};

export default nextConfig;
