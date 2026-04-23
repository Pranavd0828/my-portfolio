'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function VolumetricGlow() {
    const prefersReducedMotion = useReducedMotion();

    const firstGlowAnimate = prefersReducedMotion
        ? undefined
        : {
              x: ['0%', '5%', '-2%', '0%'],
              y: ['0%', '3%', '-4%', '0%'],
              scale: [1, 1.05, 0.95, 1],
              opacity: [0.2, 0.3, 0.15, 0.2],
          };

    const secondGlowAnimate = prefersReducedMotion
        ? undefined
        : {
              x: ['0%', '-5%', '3%', '0%'],
              y: ['0%', '-4%', '5%', '0%'],
              scale: [1, 0.95, 1.05, 1],
              opacity: [0.15, 0.25, 0.2, 0.15],
          };

    return (
        <div className="fixed inset-0 z-[-10] pointer-events-none overflow-hidden bg-[#0B0C10]">
            <motion.div
                className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full opacity-30 mix-blend-screen"
                style={{
                    background: 'radial-gradient(circle, rgba(200,220,255,0.08) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(100px)'
                }}
                animate={firstGlowAnimate}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            <motion.div
                className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full opacity-20 mix-blend-screen"
                style={{
                    background: 'radial-gradient(circle, rgba(255,240,220,0.06) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(120px)'
                }}
                animate={secondGlowAnimate}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 2,
                }}
            />

            {/* Subtle vignette to darken the edges and pull focus to the center. */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,12,16,0.8)_100%)] pointer-events-none" />
        </div>
    );
}
