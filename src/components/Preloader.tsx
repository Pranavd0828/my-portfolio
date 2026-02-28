'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from './LoadingContext';

export default function Preloader() {
    const [counter, setCounter] = useState(0);
    const [shouldRender, setShouldRender] = useState(true);
    const { setIsLoaded } = useLoading();

    useEffect(() => {
        // Check session storage first.
        // We only want to show the preloader once per session.
        const hasSeenPreloader = sessionStorage.getItem('hasSeenPreloader');

        if (hasSeenPreloader) {
            setShouldRender(false);
            setIsLoaded(true);
            return;
        }

        // Lock scroll while preloading
        document.body.style.overflow = 'hidden';

        // Animate counter non-linearly
        let startTimestamp: number | null = null;
        const duration = 2000; // 2 seconds

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Non-linear ease-out curve mathematically
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setCounter(Math.floor(easeOutExpo * 100));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                // Done loading
                setTimeout(() => {
                    setShouldRender(false);
                    sessionStorage.setItem('hasSeenPreloader', 'true');
                    // Unlock scroll and notify global app state
                    document.body.style.overflow = '';
                    setIsLoaded(true);
                }, 400); // Hold at 100 for a split second
            }
        };

        window.requestAnimationFrame(step);

        return () => {
            document.body.style.overflow = '';
        };
    }, [setIsLoaded]);

    return (
        <AnimatePresence>
            {shouldRender && (
                <motion.div
                    key="preloader"
                    initial={{ y: 0 }}
                    exit={{ y: '-100dvh' }}
                    transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[9999] bg-[#0B0C10] flex items-end justify-end p-6 md:p-8 text-foreground font-mono pointer-events-none"
                >
                    <motion.div
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="text-[10px] md:text-sm tracking-[0.4em] text-white/30 uppercase"
                    >
                        Loading [{counter.toString().padStart(3, '0')}/100]
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
