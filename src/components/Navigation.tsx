'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from './LenisContext';

export default function Navigation() {
    const pathname = usePathname();
    const lenis = useLenis();
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!mounted) return null;

    const isHome = pathname === '/';
    const isWorkSlug = pathname.startsWith('/work/');
    const isWorkIndex = pathname === '/work';

    // Smart logo click: if already on home, scroll to top via Lenis.
    // Otherwise navigate to home (where SmoothScroll will land at top).
    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isHome) {
            e.preventDefault();
            if (lenis) {
                lenis.scrollTo(0, { duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            // Clear the hash from the URL without a route change
            if (window.location.hash) {
                history.replaceState(null, '', '/');
            }
        }
    };

    // Smart "All Work" click: if already on /work, scroll to top via Lenis.
    const handleAllWorkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isWorkIndex) {
            e.preventDefault();
            if (lenis) {
                lenis.scrollTo(0, { duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            if (window.location.hash) {
                history.replaceState(null, '', '/work');
            }
        }
    };

    return (
        <motion.header
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={[
                'fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-6 md:px-12 h-14 transition-all duration-500',
                scrolled
                    ? 'bg-[#0B0C10]/80 backdrop-blur-md border-b border-white/[0.05]'
                    : 'bg-transparent border-b border-transparent',
            ].join(' ')}
        >
            <Link
                href="/"
                onClick={handleLogoClick}
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors"
            >
                Pranav Deo
            </Link>

            <nav className="flex items-center gap-6 md:gap-8">
                {isHome && (
                    <>
                        <a
                            href="#journey"
                            className="hidden md:block font-mono text-[10px] uppercase tracking-widest text-white/35 hover:text-white transition-colors"
                        >
                            Journey
                        </a>
                        <a
                            href="#prototypes"
                            className="hidden md:block font-mono text-[10px] uppercase tracking-widest text-white/35 hover:text-white transition-colors"
                        >
                            Prototypes
                        </a>
                        <Link
                            href="/work"
                            className="font-mono text-[10px] uppercase tracking-widest text-white/80 hover:text-white transition-colors border border-white/20 hover:border-white/50 px-3 py-1.5 rounded-sm"
                        >
                            Case Studies
                        </Link>
                        <a
                            href="#connect"
                            className="font-mono text-[10px] uppercase tracking-widest text-white/35 hover:text-white transition-colors"
                        >
                            Connect
                        </a>
                    </>
                )}

                {isWorkIndex && (
                    <>
                        <Link
                            href="/"
                            className="font-mono text-[10px] uppercase tracking-widest text-white/35 hover:text-white transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/#connect"
                            className="font-mono text-[10px] uppercase tracking-widest text-white/80 hover:text-white transition-colors border border-white/20 hover:border-white/50 px-3 py-1.5 rounded-sm"
                        >
                            Connect
                        </Link>
                    </>
                )}

                {isWorkSlug && (
                    <>
                        <Link
                            href="/work"
                            onClick={handleAllWorkClick}
                            className="hidden md:block font-mono text-[10px] uppercase tracking-widest text-white/35 hover:text-white transition-colors"
                        >
                            All Work
                        </Link>
                        <Link
                            href="/"
                            className="font-mono text-[10px] uppercase tracking-widest text-white/35 hover:text-white transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/#connect"
                            className="font-mono text-[10px] uppercase tracking-widest text-white/80 hover:text-white transition-colors border border-white/20 hover:border-white/50 px-3 py-1.5 rounded-sm"
                        >
                            Connect
                        </Link>
                    </>
                )}

                {/* Other routes (escape, rpsls, reading, playground) */}
                {!isHome && !isWorkIndex && !isWorkSlug && (
                    <>
                        <Link
                            href="/"
                            className="font-mono text-[10px] uppercase tracking-widest text-white/35 hover:text-white transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/#connect"
                            className="font-mono text-[10px] uppercase tracking-widest text-white/80 hover:text-white transition-colors border border-white/20 hover:border-white/50 px-3 py-1.5 rounded-sm"
                        >
                            Connect
                        </Link>
                    </>
                )}
            </nav>
        </motion.header>
    );
}
