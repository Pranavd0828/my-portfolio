import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Experimental Playground',
    description:
        'An isolated sandbox for prototyping components, interactions, and aesthetic tests inside the Cinematic Calm design system before they reach the main site.',
};

export default function Playground() {
    return (
        <main className="w-full min-h-screen pt-32 pb-16 px-6 selection:bg-accent/20">
            {/* Minimalistic Navigation Back to Main */}
            <Link
                href="/"
                className="fixed top-8 left-8 md:top-12 md:left-12 text-xs font-mono uppercase tracking-widest text-muted hover:text-accent transition-colors z-50 flex items-center gap-2"
            >
                <span className="text-lg leading-none mb-[2px]">&larr;</span> Back
            </Link>

            <div className="w-full max-w-6xl mx-auto flex flex-col">
                <div className="flex flex-col mb-16">
                    <h1 className="font-serif text-4xl md:text-6xl text-accent mb-6">Experimental Playground</h1>
                    <p className="font-sans text-muted max-w-xl text-sm md:text-base leading-relaxed">
                        An isolated environment utilizing the Cinematic Calm design system. This space is meant for prototyping new components, interactions, and aesthetic tests before integrating them into the main site.
                    </p>
                </div>

                {/* Experimental Content Container */}
                <div className="w-full min-h-[500px] border border-white/5 bg-white/[0.02] rounded-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                    <span className="font-mono text-xs text-muted uppercase tracking-widest z-10">
                        Ready for deployment. What are we building?
                    </span>
                </div>
            </div>
        </main>
    );
}
