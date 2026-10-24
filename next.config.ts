import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  distDir: process.env.PORTFOLIO_DIST_DIR || '.next',
  poweredByHeader: false,
  async redirects() {
    return ['deopranav.com', 'www.deopranav.com', 'pranavdeo.info'].map((host) => ({
      source: '/:path*',
      has: [{ type: 'host' as const, value: host.replaceAll('.', '\\.') }],
      destination: 'https://www.pranavdeo.info/:path*',
      permanent: true,
    }))
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}
export default nextConfig
