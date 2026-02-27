'use client';

import { AnimatePresence, motion, Easing } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';

// The SVG path morphs from a flat line at the bottom, to a full screen curve, to a flat line at the top
const anim = {
    initial: {
        top: "-300px",
    },
    enter: {
        top: "-100vh",
        transition: { duration: 0.75, delay: 0.35, ease: [0.76, 0, 0.24, 1] as Easing },
        transitionEnd: { top: "100vh" }
    },
    exit: {
        top: "-300px",
        transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] as Easing }
    }
}

export default function PageTransitionProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        });

        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const initialPath = `
        M0 300 
        Q${dimensions.width / 2} 0 ${dimensions.width} 300
        L${dimensions.width} ${dimensions.height + 300}
        Q${dimensions.width / 2} ${dimensions.height + 600} 0 ${dimensions.height + 300}
        L0 0
    `;

    const targetPath = `
        M0 300
        Q${dimensions.width / 2} 0 ${dimensions.width} 300
        L${dimensions.width} ${dimensions.height}
        Q${dimensions.width / 2} ${dimensions.height} 0 ${dimensions.height}
        L0 0
    `;

    const curve = {
        initial: {
            d: initialPath
        },
        enter: {
            d: targetPath,
            transition: { duration: 0.75, delay: 0.35, ease: [0.76, 0, 0.24, 1] as Easing }
        },
        exit: {
            d: initialPath,
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] as Easing }
        }
    }

    // Don't render the crazy SVG until we have actual dimensions to prevent hydration mismatch
    if (dimensions.width === 0) return <>{children}</>;

    return (
        <AnimatePresence mode="wait">
            <motion.div key={pathname} className="relative w-full h-full">

                {/* The "Curtain" that drops down when leaving a page */}
                <motion.div
                    variants={anim}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    className="fixed left-0 top-0 w-full h-[calc(100vh+600px)] z-[9998] pointer-events-none"
                >
                    <svg className="absolute w-full h-full top-0 left-0" preserveAspectRatio="none">
                        <motion.path
                            variants={curve}
                            initial="initial"
                            animate="enter"
                            exit="exit"
                            className="fill-[#0B0C10]"
                        />
                    </svg>
                </motion.div>

                {/* The new page content fading in slightly below the curtain */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.76, 0, 0.24, 1] as Easing }}
                >
                    {children}
                </motion.div>

            </motion.div>
        </AnimatePresence>
    );
}
