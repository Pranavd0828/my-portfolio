'use client';

import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { useLoading } from './LoadingContext';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const { isLoaded } = useLoading();
    const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        setLenisInstance(lenis);

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    useEffect(() => {
        if (isLoaded && lenisInstance && window.location.hash) {
            // Delay slightly to wait for RevealFocus and Preloader teardown layout shifts
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    lenisInstance.scrollTo(target, { immediate: true });
                }
            }, 100);
        }
    }, [isLoaded, lenisInstance]);

    return <>{children}</>;
}
