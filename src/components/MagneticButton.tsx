'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCursor } from './CursorContext';

export default function MagneticButton({
    children,
    className = '',
    type = 'button',
}: {
    children: React.ReactNode;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}) {
    const ref = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const { setCursorVariant } = useCursor();
    const [isMouseDevice, setIsMouseDevice] = useState(false);

    useEffect(() => {
        setIsMouseDevice(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    }, []);

    const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!isMouseDevice) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current!.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
    };

    const reset = () => {
        if (!isMouseDevice) return;
        setPosition({ x: 0, y: 0 });
        setCursorVariant('default');
    };

    const handleMouseEnter = () => {
        if (!isMouseDevice) return;
        setCursorVariant('hover');
    };

    return (
        <motion.button
            type={type}
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            onMouseEnter={handleMouseEnter}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
            className={`relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium border rounded-full group ${className}`}
        >
            <span className="relative z-10">{children}</span>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
    );
}
