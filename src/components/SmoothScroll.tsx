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

    // --- Save scroll position for current path on every scroll tick ---
    useEffect(() => {
        if (!lenisInstance) return;

        const handler = ({ scroll }: { scroll: number }) => {
            try {
                sessionStorage.setItem(`scroll:${pathname}`, String(Math.round(scroll)));
            } catch {
                // sessionStorage unavailable in some private browsing contexts
            }
        };

        lenisInstance.on('scroll', handler);
        return () => lenisInstance.off('scroll', handler);
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
