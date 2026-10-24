import localFont from 'next/font/local'
import { profile } from '@/content/profile'
import Navigation from '@/components/Navigation'
import BrandIntro from '@/components/BrandIntro'
import Link from 'next/link'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
const inter = localFont({
  src: '../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  variable: '--font-inter', weight: '100 900', display: 'swap',
})
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#080808',
  colorScheme: 'dark',
}
export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: 'Pranav Deo | Staff Product Manager at Rakuten',
    template: '%s | Pranav Deo',
  },
  description:
    profile.description,
  openGraph: {
    title: 'Pranav Deo | Product leadership, technical depth, and curiosity',
    description:
      'The background, product decisions, and independent explorations of Pranav Deo, Staff Product Manager at Rakuten.',
    url: profile.siteUrl,
    siteName: 'Pranav Deo',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/social-preview.png',
        width: 1200,
        height: 630,
        alt: 'Pranav Deo. Staff Product Manager at Rakuten. Advertiser goals. Customer value. Product judgment.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pranav Deo | Product leadership, technical depth, and curiosity',
    description:
      'The background, product decisions, and independent explorations of Pranav Deo, Staff Product Manager at Rakuten.',
    images: ['/social-preview.png'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: {
      url: '/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
    },
  },
}
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a href="#main-content" className="skip-link" tabIndex={0}>
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Person', name: profile.name,
          url: profile.siteUrl, jobTitle: profile.currentTitle,
          worksFor: { '@type': 'Organization', name: profile.employer },
          sameAs: ['https://linkedin.com/in/pranav-deo', 'https://github.com/Pranavd0828'],
        }).replace(/</g, '\\u003c') }} />
        <BrandIntro />
        <Navigation />
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
        <footer className="footer">
          <div className="shell footer-inner">
            <p>
              Pranav Deo · Product leadership across ads, AI, marketplaces, and
              consumer experiences.
            </p>
            <nav aria-label="Footer navigation">
              <Link prefetch={false} href="/reading">
                Reading
              </Link>
              <Link prefetch={false} href="/playground">
                Playground
              </Link>
              <a
                href="https://github.com/Pranavd0828"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a href="mailto:deopranav2808.work@gmail.com">Email</a>
            </nav>
          </div>
        </footer>
        {process.env.VERCEL_ENV === 'production' && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}
