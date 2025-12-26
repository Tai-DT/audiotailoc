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
    unoptimized: false, // Enable image optimization
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
