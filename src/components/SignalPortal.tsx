'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

// --- 3D Wireframe Component ---

function WireframePortal({ nodes, edges, size = 16, rotationSpeed = 0.02 }: { nodes: number[][], edges: number[][], size?: number, rotationSpeed?: number }) {
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        let frame: number;
        const animate = () => {
            setRotation(prev => prev + rotationSpeed);
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [rotationSpeed]);

    const cosT = Math.cos(rotation);
    const sinT = Math.sin(rotation);
    const cosT2 = Math.cos(rotation * 0.5);
    const sinT2 = Math.sin(rotation * 0.5);

    const projectedNodes = nodes.map(node => {
        let x = node[0];
        let y = node[1];
        let z = node[2];

        // Rotate X
        let y1 = y * cosT - z * sinT;
        let z1 = y * sinT + z * cosT;
        y = y1;
        z = z1;

        // Rotate Y
        let x1 = x * cosT2 - z * sinT2;
        let z2 = x * sinT2 + z * cosT2;
        x = x1;
        z = z2;

        return {
            x: 20 + x * size,
            y: 20 + y * size
        };
    });

    return (
        <svg width="40" height="40" viewBox="0 0 40 40" className="pointer-events-none">
            <g stroke="#ffffff" strokeWidth="0.5" fill="none">
                {edges.map((edge, i) => (
                    <line
                        key={i}
                        x1={projectedNodes[edge[0]].x}
                        y1={projectedNodes[edge[0]].y}
                        x2={projectedNodes[edge[1]].x}
                        y2={projectedNodes[edge[1]].y}
                        className="opacity-70"
                    />
                ))}
            </g>
            <circle cx="20" cy="20" r="15" fill="url(#portal-glow)" opacity="0.1" />
            <defs>
                <radialGradient id="portal-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="white" />
                    <stop offset="100%" stopColor="transparent" />
                </radialGradient>
            </defs>
        </svg>
    );
}

// --- Geometry Definitions ---

const CUBE_NODES = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
];
const CUBE_EDGES = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
];

const PENT_NODES = (() => {
    const nodes = [];
    for (let i = 0; i < 5; i++) {
        const phi = (i * 72 * Math.PI) / 180;
        nodes.push([Math.cos(phi), Math.sin(phi), -0.5]);
        nodes.push([Math.cos(phi), Math.sin(phi), 0.5]);
    }
    return nodes;
})();
const PENT_EDGES = (() => {
    const edges = [];
    for (let i = 0; i < 10; i += 2) {
        edges.push([i, (i + 2) % 10]);
        edges.push([i + 1, (i + 3) % 10]);
        edges.push([i, i + 1]);
    }
    return edges;
})();

// --- Main Component ---

export default function SignalPortal() {
    const [hoveredPortal, setHoveredPortal] = useState<'escape' | 'duel' | null>(null);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const portals = [
        {
            id: 'escape',
            label: '[ INITIATE_ESCAPE ]',
            href: '/escape',
            position: 'bottom-6 right-6 md:bottom-12 md:right-12',
            nodes: CUBE_NODES,
            edges: CUBE_EDGES,
            visible: pathname !== '/escape'
        },
        {
            id: 'duel',
            label: '[ INITIATE_DUEL ]',
            href: '/rpsls',
            position: pathname === '/escape' ? 'top-6 right-36 md:top-8 md:right-48' : 'top-6 right-6 md:top-12 md:right-12',
            nodes: PENT_NODES,
            edges: PENT_EDGES,
            visible: pathname !== '/rpsls'
        }
    ];

    return (
        <>
            {portals.map((portal) => portal.visible && (
                <motion.div
                    key={portal.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className={`fixed ${portal.position} z-[100] flex items-center justify-end`}
                    onMouseEnter={() => setHoveredPortal(portal.id as any)}
                    onMouseLeave={() => setHoveredPortal(null)}
                >
                    <button
                        onClick={() => window.location.href = portal.href}
                        className="group relative flex items-center justify-center p-6 -m-6 cursor-pointer focus:outline-none"
                        aria-label={portal.label.replace('[ ', '').replace(' ]', '').toLowerCase()}
                    >
                        <div className="flex items-center gap-3">
                            <AnimatePresence mode="wait">
                                {hoveredPortal === portal.id && (
                                    <motion.span
                                        initial={{ opacity: 0, x: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: 5, scale: 0.95 }}
                                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                        className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/90 whitespace-nowrap px-4 py-2 bg-[#0B0C10]/60 backdrop-blur-md border border-white/10 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                                    >
                                        {portal.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            <div className="relative flex items-center justify-center w-10 h-10">
                                <motion.div
                                    animate={{
                                        scale: hoveredPortal === portal.id ? 1.2 : 1,
                                        opacity: hoveredPortal === portal.id ? 1 : 0.5
                                    }}
                                    className="transition-opacity duration-500 mix-blend-difference"
                                >
                                    <WireframePortal
                                        nodes={portal.nodes}
                                        edges={portal.edges}
                                        size={portal.id === 'escape' ? 11 : 14}
                                        rotationSpeed={portal.id === 'escape' ? 0.01 : 0.008}
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </button>
                </motion.div>
            ))}
        </>
    );
}
