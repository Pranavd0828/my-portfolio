'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

function DustParticles({ count }: { count: number }) {
    const ref = useRef<THREE.Points>(null!);
    const prefersReducedMotion = useReducedMotion();

    const positions = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        return positions;
    }, [count]);

    useFrame((state, delta) => {
        if (prefersReducedMotion) return;
        if (ref.current) {
            ref.current.rotation.x -= delta / 30;
            ref.current.rotation.y -= delta / 40;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#EAEAEB"
                    size={0.02}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.3}
                />
            </Points>
        </group>
    );
}

export default function CanvasBackground() {
    const [particleCount, setParticleCount] = useState(2000);

    useEffect(() => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        setParticleCount(isMobile ? 800 : 2000);
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-background">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                dpr={[1, 2]}
                performance={{ min: 0.5 }}
                gl={{ antialias: false, powerPreference: 'low-power' }}
            >
                <DustParticles count={particleCount} />
            </Canvas>
        </div>
    );
}
