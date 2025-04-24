/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/user/:path*',
        destination: 'http://localhost:5294/api/user/:path*'
      },
    ];
  },
};

module.exports = nextConfig;