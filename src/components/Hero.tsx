'use client';

import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <section
            ref={containerRef}
            className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden px-6"
        >
            <motion.div
                style={{ y, opacity }}
                className="text-center z-10 flex flex-col items-center"
            >
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="font-sans text-base md:text-lg uppercase tracking-[0.2em] text-muted mb-8"
                >
                    <span className="text-white font-medium">Pranav Deo</span> <span className="mx-2 opacity-50">&bull;</span> Technical Product Manager
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="font-serif text-5xl md:text-8xl lg:text-9xl tracking-tight text-accent leading-none max-w-5xl"
                    style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                >
                    Ads Platform <br />
                    <span className="italic text-muted">&amp;</span> GenAI
                </motion.h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
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
