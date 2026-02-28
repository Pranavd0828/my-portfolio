'use client';

import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useLoading } from './LoadingContext';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { isLoaded } = useLoading();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden px-6"
        >
            <motion.div
                style={{ y, opacity }}
                className="text-center z-10 flex flex-col items-center"
            >
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="font-mono text-[10px] md:text-sm uppercase tracking-[0.3em] text-white/50 mb-8"
                >
                    <span className="text-white">Pranav Deo</span> <span className="mx-2 opacity-30">&bull;</span> Technical Product Manager
                </motion.p>

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
                        animate={{
                            scaleY: [0, 1, 0],
                            translateY: ['-100%', '0%', '100%']
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>
            </motion.div>

            {/* Subtle radial gradient to separate text from background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(11,12,16,0.8)_100%)] pointer-events-none" />
        </section>
    );
}
