'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function RevealFocus({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["0 1", "0.3 1"], // Start when top hits bottom of screen, finish when it's 30% up the screen (faster emerge)
    });

    const scale = useTransform(scrollYProgress, [0, 1], [0.98, 1.0]);
    const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
    const filter = useTransform(scrollYProgress, [0, 1], ["blur(4px)", "blur(0px)"]);

    return (
        <motion.div
            ref={ref}
            style={{ scale, opacity, filter }}
            className={`w-full ${className}`}
        >
            {children}
        </motion.div>
    );
}
