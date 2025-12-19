/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production-ready configuration
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache images for 30 days in production
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Disable static imports optimization for better compatibility
    disableStaticImages: false,
  },
  
  // Compression and performance
  compress: true,
  poweredByHeader: false,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Headers for security and caching
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
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
    {
      source: '/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=2592000, must-revalidate',
        },
      ],
    },
  ],

  // Environment configuration
  env: {
    NEXT_PUBLIC_APP_NAME: 'Cartcuterie',
  },
}

export default nextConfig