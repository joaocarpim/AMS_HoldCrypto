/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com"
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/user/:path*',
        destination: 'http://localhost:5294/api/user/:path*'
      },
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:5294/api/auth/:path*'
      },
    ];
  },
};

module.exports = nextConfig;