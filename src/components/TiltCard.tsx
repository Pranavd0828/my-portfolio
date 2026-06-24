'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

export default function TiltCard({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [isMouseDevice, setIsMouseDevice] = useState(false);

    useEffect(() => {
        setIsMouseDevice(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    }, []);

    // Physics values
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    // Spring interpolation for smooth entry/exit
    const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Map 0-1 relative values to rotation angles
    const rotateX = useTransform(springY, [0, 1], [10, -10]);
    const rotateY = useTransform(springX, [0, 1], [-10, 10]);

    // Map the relative mouse position to a spotlight gradient
    const glareX = useTransform(springX, [0, 1], [0, 100]);
    const glareY = useTransform(springY, [0, 1], [0, 100]);
    const background = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.1) 0%, transparent 60%)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isMouseDevice || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();

        // Calculate relative position 0 to 1 inside the card
        const relativeX = (e.clientX - rect.left) / rect.width;
        const relativeY = (e.clientY - rect.top) / rect.height;

        mouseX.set(relativeX);
        mouseY.set(relativeY);
    };

    const handleMouseLeave = () => {
        if (!isMouseDevice) return;
        // Reset to center
        mouseX.set(0.5);
        mouseY.set(0.5);
    };

    if (!isMouseDevice) {
        // Fallback for mobile: standard tactile scale wrapper, no tilt
        return (
            <div className={`active:scale-[0.98] transition-transform duration-300 ${className}`}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1000,
                rotateX,
                rotateY,
            }}
            className={`relative group ${className}`}
        >
            {/* The glare layer. Follows the mouse position. */}
            <motion.div
                className="absolute inset-0 z-10 pointer-events-none rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background }}
            />
            {children}
        </motion.div>
    );
}
