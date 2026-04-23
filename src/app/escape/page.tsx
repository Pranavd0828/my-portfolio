import type { Metadata } from 'next';
import EscapeGame from '@/components/EscapeGame';

export const metadata: Metadata = {
    title: 'Escape Protocol',
    description:
        'A brutalist, endless-runner simulation built on high-performance requestAnimationFrame mechanics, featuring a 3D wireframe player and dynamic gravity physics.',
};

export default function EscapePage() {
    return (
        <main className="w-full h-screen overflow-hidden bg-background text-foreground flex items-center justify-center p-0 m-0">
            <EscapeGame />
        </main>
    );
}
