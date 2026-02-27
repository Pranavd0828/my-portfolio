import CanvasBackground from "@/components/CanvasBackground";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import PageTransitionProvider from "@/components/PageTransitionProvider";
import { LoadingProvider } from "@/components/LoadingContext";
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
  title: "Pranav Deo | Portfolio",
  description: "Senior Product Manager specializing in AI and AdTech.",
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
            <PageTransitionProvider>
              {children}
            </PageTransitionProvider>
          </SmoothScroll>
        </LoadingProvider>
      </body>
    </html>
  );
}
