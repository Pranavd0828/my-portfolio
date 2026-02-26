'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const caseStudies = [
    {
        id: '01',
        title: 'AI Personalization Engine',
        role: 'Lead Product Manager',
        year: '2024 - Present',
        description: 'Spearheaded the development of a real-time AI recommendation system that increased user retention by 45%.',
        media: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop', // Abstract tech
    },
    {
        id: '02',
        title: 'AdTech Bidding Platform',
        role: 'Senior PM',
        year: '2022 - 2024',
        description: 'Architected a programmatic ad bidding ecosystem processing over 10B requests daily with sub-10ms latency.',
        media: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop', // Data abstract
    },
    {
        id: '03',
        title: 'Identity Resolution Graph',
        role: 'Product Manager',
        year: '2020 - 2022',
        description: 'Built a privacy-first identity graph unifying fragmented user profiles across mobile and web platforms.',
        media: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop', // Abstract nodes
    }
];

export default function Journey() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const activeStudy = caseStudies.find(study => study.id === hoveredId);

    return (
        <section className="relative w-full min-h-screen py-32 px-6 flex flex-col justify-center">

            {/* Dynamic Background Reveal */}
            <AnimatePresence>
                {activeStudy && (
                    <motion.div
                        key={activeStudy.id}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 0.3, scale: 1 }}
                        exit={{ opacity: 0, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute inset-0 z-0 select-none overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] z-10" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={activeStudy.media}
                            alt={activeStudy.title}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 max-w-6xl w-full mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24">
                    <h2 className="font-serif text-5xl md:text-7xl text-accent">Selected<br />Works</h2>
                    <p className="font-sans text-muted max-w-sm mt-6 md:mt-0">
                        A curated timeline of platform-defining product launches focusing on data scalability and algorithmic intelligence.
                    </p>
                </div>

                <div className="flex flex-col border-t border-white/10">
                    {caseStudies.map((study) => (
                        <div
                            key={study.id}
                            onMouseEnter={() => setHoveredId(study.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className="group relative flex flex-col md:flex-row md:items-center justify-between py-12 border-b border-white/5 cursor-pointer transition-colors hover:border-white/20"
                        >
                            <div className="flex-1 md:pr-12">
                                <div className="flex items-center gap-6 mb-4">
                                    <span className="text-sm font-mono text-muted">{study.id}</span>
                                    <span className="text-xs uppercase tracking-widest px-3 py-1 border border-white/10 rounded-full text-accent">
                                        {study.role}
                                    </span>
                                </div>
                                <h3 className="font-serif text-3xl md:text-5xl text-accent group-hover:pl-4 transition-all duration-500 ease-out">{study.title}</h3>
                            </div>

                            <div className="flex-1 md:pl-12 mt-6 md:mt-0 flex flex-col md:items-end md:text-right">
                                <p className="text-muted max-w-md group-hover:text-accent/80 transition-colors duration-500">
                                    {study.description}
                                </p>
                                <span className="text-sm font-sans text-muted/60 mt-4">{study.year}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
