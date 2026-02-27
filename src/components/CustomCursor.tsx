'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCursor } from './CursorContext';

export default function CustomCursor() {
    const { cursorVariant } = useCursor();
    const [isVisible, setIsVisible] = useState(false);

    // We strictly only enable this on devices with a physical mouse
    const [isMouseDevice, setIsMouseDevice] = useState(false);

    useEffect(() => {
        const checkPointer = () => {
            setIsMouseDevice(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
        };
        checkPointer();
        window.addEventListener('resize', checkPointer);
        return () => window.removeEventListener('resize', checkPointer);
    }, []);

    // Motion values for direct DOM manipulation without React renders
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Spring physics for the organic, weighty feel
    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        if (!isMouseDevice) return;

        const moveCursor = (e: MouseEvent) => {
            if (!isVisible) setIsVisible(true);
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', moveCursor);
        document.body.addEventListener('mouseleave', handleMouseLeave);
        document.body.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [isMouseDevice, cursorX, cursorY, isVisible]);

    if (!isMouseDevice || !isVisible) return null;

    const variants = {
        default: {
            height: 12,
            width: 12,
            x: '-50%',
            y: '-50%',
            backgroundColor: 'rgba(234, 234, 235, 1)', // accent
            mixBlendMode: 'normal' as const,
        },
        hover: {
            height: 48,
            width: 48,
            x: '-50%',
            y: '-50%',
            backgroundColor: 'rgba(255, 255, 255, 1)',
            mixBlendMode: 'difference' as const,
        },
        hidden: {
            opacity: 0,
            height: 0,
            width: 0,
        }
    };

    return (
        <motion.div
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[9990] hidden md:block"
            variants={variants}
            animate={cursorVariant}
            transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
            style={{
                x: cursorXSpring,
                y: cursorYSpring,
            }}
        />
    );
}
