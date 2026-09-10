import Navigation from "@/components/Navigation";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL("https://www.deopranav.com"),
  title: {
    default: "Pranav Deo — Staff Product Manager · Ads, AI & Marketplaces",
    template: "%s | Pranav Deo",
  },
  description:
    "Staff Product Manager at Rakuten connecting advertising, marketplace economics, AI infrastructure, and consumer experience. Explore professional outcomes and eight independent prototypes.",
  openGraph: {
    title: "Pranav Deo — Staff PM · Ads, AI & Marketplaces",
    description:
      "Ads and marketplace product leadership, technical depth, and eight independent consumer prototypes.",
    url: "https://www.deopranav.com",
    siteName: "Pranav Deo",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/favicon.jpg",
        width: 1105,
        height: 1105,
        alt: "Pranav Deo Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranav Deo — Staff PM · Ads, AI & Marketplaces",
    description:
      "Ads and marketplace product leadership, technical depth, and eight independent consumer prototypes.",
    images: ["/favicon.jpg"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Navigation />
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
        <footer className="footer">
          <div className="shell footer-inner">
            <p>Pranav Deo · Product, systems, and a little curiosity.</p>
            <nav aria-label="Footer navigation">
              <Link href="/reading">Reading</Link>
              <Link href="/playground">Playground</Link>
              <a
                href="https://github.com/Pranavd0828"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </a>
              <a href="mailto:deopranav2808.work@gmail.com">Email ↗</a>
            </nav>
          </div>
        </footer>
        {process.env.NODE_ENV === "production" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
