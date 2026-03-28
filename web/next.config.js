/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com',
      's3.amazonaws.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  },
  // Optimize bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
