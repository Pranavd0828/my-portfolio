'use client';

import { useRef } from 'react';
import { useScroll, useTransform, motion, useReducedMotion } from 'framer-motion';
import { useLoading } from './LoadingContext';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { isLoaded } = useLoading();
    const prefersReducedMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <section
            id="hero"
            ref={containerRef}
            className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden px-6"
        >
            <motion.div
                style={{ y, opacity }}
                className="text-center z-10 flex flex-col items-center"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="font-mono text-[10px] md:text-sm uppercase tracking-[0.3em] text-white/50 mb-8"
                >
                    {/* Mobile: stacked on three lines */}
                    <span className="flex flex-col items-center gap-1.5 md:hidden">
                        <span className="text-white">Pranav Deo</span>
                        <span>Product Manager</span>
                        <span>Hands-on with GenAI</span>
                    </span>
                    {/* Desktop: single inline line */}
                    <span className="hidden md:inline">
                        <span className="text-white">Pranav Deo</span> <span className="mx-2 opacity-30">&bull;</span> Product Manager · Hands-on with GenAI
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="font-serif text-4xl leading-tight md:text-8xl lg:text-9xl tracking-tight text-white md:leading-none max-w-5xl"
                    style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                >
                    Ads Platform <br className="hidden md:block" />
                    <span className="text-white/30">&amp;</span> GenAI
                </motion.h1>

                {/* Primary CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-10 md:mt-12"
                >
                    <a
                        href="#prototypes"
                        className="font-mono text-[10px] uppercase tracking-widest text-white/90 hover:text-white transition-colors border border-white/25 hover:border-white/60 px-6 py-3 rounded-sm bg-white/5 hover:bg-white/10 inline-flex items-center gap-2"
                    >
                        View Prototypes
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </a>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1, delay: 1 }}
                style={{ opacity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
            >
                <span className="text-xs uppercase tracking-widest text-muted">Scroll to explore</span>
                <div className="w-[1px] h-12 bg-muted/50 overflow-hidden relative">
                    <motion.div
                        className="w-full h-full bg-accent origin-top"
                        animate={
                            prefersReducedMotion
                                ? undefined
                                : {
                                      scaleY: [0, 1, 0],
                                      translateY: ['-100%', '0%', '100%'],
                                  }
                        }
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>
            </motion.div>

            {/* Subtle radial gradient to separate text from background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(11,12,16,0.8)_100%)] pointer-events-none" />
        </section>
    );
}
