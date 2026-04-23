'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { useLoading } from './LoadingContext';
import { LenisContext } from './LenisContext';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const { isLoaded } = useLoading();
    const lenisRef = useRef<Lenis | null>(null);
    const rafIdRef = useRef<number | null>(null);
    const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
    const pathname = usePathname();
    const isPopState = useRef(false);

    // --- Lenis init (once, StrictMode-safe) ---
    useEffect(() => {
        if (lenisRef.current) return;

        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;
        setLenisInstance(lenis);

        const raf = (time: number) => {
            lenis.raf(time);
            rafIdRef.current = requestAnimationFrame(raf);
        };
        rafIdRef.current = requestAnimationFrame(raf);

        return () => {
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    // --- Intercept ALL same-page anchor clicks and route through Lenis ---
    // Plain <a href="#section"> bypasses Lenis; this fixes every anchor on the site.
    useEffect(() => {
        if (!lenisInstance) return;

        const handleAnchorClick = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
            if (!anchor) return;
            const hash = anchor.getAttribute('href');
            if (!hash || hash === '#') return;
            const target = document.querySelector(hash) as HTMLElement | null;
            if (!target) return;
            e.preventDefault();
            lenisInstance.scrollTo(target, { duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        };

        document.addEventListener('click', handleAnchorClick);
        return () => document.removeEventListener('click', handleAnchorClick);
    }, [lenisInstance]);

    // --- Detect browser back/forward ---
    useEffect(() => {
        const handler = () => { isPopState.current = true; };
        window.addEventListener('popstate', handler);
        return () => window.removeEventListener('popstate', handler);
    }, []);

    // --- Save scroll position for current path, throttled to avoid per-tick sessionStorage writes ---
    // Lenis fires at 60 to 120 Hz; writing storage that often causes micro-stutter and GC pressure on mobile.
    // Strategy: remember the latest scroll value on every tick, flush at most once per 150ms, and flush on
    // pagehide so the final position is never lost when the user navigates away.
    useEffect(() => {
        if (!lenisInstance) return;

        let latestScroll = 0;
        let scheduled = false;
        let lastFlushAt = 0;
        const FLUSH_INTERVAL_MS = 150;

        const flush = () => {
            scheduled = false;
            lastFlushAt = Date.now();
            try {
                sessionStorage.setItem(`scroll:${pathname}`, String(Math.round(latestScroll)));
            } catch {
                // sessionStorage unavailable in some private browsing contexts
            }
        };

        const handler = ({ scroll }: { scroll: number }) => {
            latestScroll = scroll;
            if (scheduled) return;
            const elapsed = Date.now() - lastFlushAt;
            const delay = Math.max(0, FLUSH_INTERVAL_MS - elapsed);
            scheduled = true;
            setTimeout(flush, delay);
        };

        const flushOnHide = () => {
            if (scheduled) flush();
        };

        lenisInstance.on('scroll', handler);
        window.addEventListener('pagehide', flushOnHide);
        document.addEventListener('visibilitychange', flushOnHide);

        return () => {
            lenisInstance.off('scroll', handler);
            window.removeEventListener('pagehide', flushOnHide);
            document.removeEventListener('visibilitychange', flushOnHide);
            if (scheduled) flush();
        };
    }, [lenisInstance, pathname]);

    // --- On route change: restore (back/forward) or scroll to top (Link click) ---
    useEffect(() => {
        if (!lenisInstance) return;

        if (isPopState.current) {
            isPopState.current = false;
            try {
                const saved = sessionStorage.getItem(`scroll:${pathname}`);
                const scrollPos = saved ? parseInt(saved, 10) : NaN;
                if (!isNaN(scrollPos)) {
                    lenisInstance.scrollTo(scrollPos, { immediate: true });
                    return;
                }
            } catch {
                // ignore
            }
        }

        // Hash in the URL (e.g. navigating to /#prototypes from another page)
        const hash = window.location.hash;
        if (hash) {
            const target = document.querySelector(hash) as HTMLElement | null;
            if (target) {
                lenisInstance.resize();
                lenisInstance.scrollTo(target, { immediate: true });
                return;
            }
        }

        // Standard forward navigation: land at the top
        lenisInstance.scrollTo(0, { immediate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    // --- Hash-link scroll after preloader clears (first page load) ---
    useEffect(() => {
        if (isLoaded && lenisInstance && window.location.hash) {
            setTimeout(() => {
                const target = document.querySelector(window.location.hash) as HTMLElement;
                if (target) {
                    lenisInstance.resize();
                    lenisInstance.scrollTo(target, { immediate: true });
                }
            }, 300);
        }
    }, [isLoaded, lenisInstance]);

    return (
        <LenisContext.Provider value={{ lenis: lenisInstance }}>
            {children}
        </LenisContext.Provider>
    );
}
