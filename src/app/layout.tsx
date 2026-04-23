import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import PageTransitionProvider from "@/components/PageTransitionProvider";
import { LoadingProvider } from "@/components/LoadingContext";
import CanvasBackground from "@/components/CanvasBackground";
import SignalPortal from "@/components/SignalPortal";
import Navigation from "@/components/Navigation";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.deopranav.com"),
  title: {
    default: "Pranav Deo | Portfolio",
    template: "%s | Pranav Deo",
  },
  description: "Senior Product Manager specializing in AI, Data Strategy, and AdTech.",
  openGraph: {
    title: "Pranav Deo | Portfolio",
    description: "Senior Product Manager specializing in AI, Data Strategy, and AdTech.",
    url: "https://www.deopranav.com",
    siteName: "Pranav Deo Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/favicon.jpg",
        width: 1200,
        height: 630,
        alt: "Pranav Deo Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranav Deo | Portfolio",
    description: "Senior Product Manager specializing in AI, Data Strategy, and AdTech.",
    images: ["/favicon.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground overflow-x-hidden`}>
        <LoadingProvider>
          <Preloader />
          <CanvasBackground />
          <SmoothScroll>
            <Navigation />
            <SignalPortal />
            <PageTransitionProvider>
              {children}
            </PageTransitionProvider>
          </SmoothScroll>
        </LoadingProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
