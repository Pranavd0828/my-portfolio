'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

export default function SignalPortal() {
    const [isHovered, setIsHovered] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Do not show the portal if we are already in the escape route
    if (!mounted || pathname === '/escape') return null;

    const handleNavigate = () => {
        // Enforce a hard navigation to completely destroy the previous React tree
        // and ensure the clean initialization of the Canvas Game physics/events.
        window.location.href = '/escape';
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1 }}
            className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-[100] mix-blend-difference flex items-center justify-end"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <button
                onClick={handleNavigate}
                className="group relative flex items-center justify-center p-6 -m-6 cursor-pointer focus:outline-none"
                aria-label="Initiate Escape Sequence"
            >
                <div className="flex items-center gap-3">
                    <AnimatePresence mode="wait">
                        {isHovered && (
                            <motion.span
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 5 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/70 whitespace-nowrap"
                            >
                                [ INITIATE_ESCAPE ]
                            </motion.span>
                        )}
                    </AnimatePresence>

                    {/* The Ambient Blip */}
                    <div className="relative flex items-center justify-center w-8 h-8">
                        <motion.div
                            animate={{
                                scale: isHovered ? [1, 1.2, 1] : [1, 1.1, 1],
                                opacity: isHovered ? 1 : [0.5, 0.9, 0.5],
                            }}
                            transition={{
                                duration: isHovered ? 1 : 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="w-7 h-7 bg-white"
                            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                        />
                        {/* Static microscopic container for precise layout */}
                        <div
                            className={`absolute inset-0 bg-white/20 w-9 h-9 -left-[2px] -top-[2px] transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-30'}`}
                            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                        />
                    </div>
                </div>
            </button>
        </motion.div>
    );
}
