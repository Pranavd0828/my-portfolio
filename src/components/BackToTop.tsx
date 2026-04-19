'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

export default function BackToTop() {
    const { scrollY } = useScroll();
    const [isVisible, setIsVisible] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        // Show after scrolling past the first section (approx 1 viewport height)
        if (latest > (typeof window !== 'undefined' ? window.innerHeight * 0.8 : 800)) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    });

    const scrollToTop = () => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 left-6 md:left-8 z-[90] flex items-center justify-center gap-2 px-6 py-3 border-[0.5px] border-white/10 bg-[#0B0C10]/80 backdrop-blur-md text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-500 overflow-hidden group cursor-pointer"
                >
                    <span className="relative z-10 transition-transform duration-500 group-hover:-translate-y-1">↑</span>
                    <span className="relative z-10">TOP</span>
                    
                    {/* Hover Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
