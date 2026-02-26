'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

type Year = '2026' | '2025' | '2024';

export default function ReadingList() {
    const [activeYear, setActiveYear] = useState<Year>('2026');

    const years: Year[] = ['2026', '2025', '2024'];

    const renderContent = () => {
        switch (activeYear) {
            case '2026':
                return (
                    <motion.div
                        key="2026"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-lg group">
                            <Image
                                src="/reading/2026_reads.jpg"
                                alt="2026 Reading List"
                                fill
                                className="object-cover transition-all duration-700 ease-out grayscale hover:grayscale-0 scale-100 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-700" />
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div className="font-mono text-xs uppercase tracking-widest text-accent">
                                07 Books Completed &amp; Planned
                            </div>
                            <p className="font-sans text-sm md:text-base text-muted max-w-2xl text-justify md:text-right leading-relaxed">
                                A selection prioritizing technical non-fiction, deep-dives into physiology, and strategic thinking. Notably featuring multiple foundational read-throughs of Bill Bryson's <span className="italic text-accent">The Body</span>.
                            </p>
                        </div>
                    </motion.div>
                );
            case '2025':
                return (
                    <motion.div
                        key="2025"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col gap-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg group">
                                <Image
                                    src="/reading/2025_reads_part_1.jpg"
                                    alt="2025 Reading List Part 1"
                                    fill
                                    className="object-cover transition-all duration-700 ease-out grayscale hover:grayscale-0 scale-100 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-700" />
                            </div>
                            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg group">
                                <Image
                                    src="/reading/2025_reads_part_2.jpg"
                                    alt="2025 Reading List Part 2"
                                    fill
                                    className="object-cover transition-all duration-700 ease-out grayscale hover:grayscale-0 scale-100 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-700" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <p className="font-sans text-sm md:text-base text-muted max-w-2xl text-justify md:text-right leading-relaxed">
                                A high-volume year spanning dense technical literature, engineering architectures, and expansive science fiction narratives.
                            </p>
                        </div>
                    </motion.div>
                );
            case '2024':
                return (
                    <motion.div
                        key="2024"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-lg group">
                            <Image
                                src="/reading/2024_reads.jpg"
                                alt="2024 Reading List"
                                fill
                                className="object-cover object-top transition-all duration-700 ease-out grayscale hover:grayscale-0 scale-100 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-700" />
                        </div>
                        <div className="flex justify-end">
                            <p className="font-sans text-sm md:text-base text-muted max-w-2xl text-justify md:text-right leading-relaxed">
                                Framing the foundational transition toward advanced AI systems and immersive product management principles.
                            </p>
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <section className="w-full max-w-6xl mx-auto py-32 px-6">
            <div className="flex flex-col mb-16">
                <Link href="/" className="text-xs font-mono uppercase tracking-widest text-muted hover:text-accent mb-8 transition-colors">
                    &larr; Back to Portfolio
                </Link>
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-8">
                    <div>
                        <h2 className="font-serif text-5xl md:text-7xl text-accent">Literature</h2>
                        <h3 className="font-serif text-3xl md:text-4xl text-muted mt-2 italic">&amp; Study</h3>
                    </div>
                    <div className="flex gap-6">
                        {years.map((year) => (
                            <button
                                key={year}
                                onClick={() => setActiveYear(year)}
                                className={`text-2xl font-serif transition-colors duration-500 ease-out ${activeYear === year ? 'text-accent' : 'text-muted/30 hover:text-muted/70'
                                    }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>
            </div>
        </section>
    );
}
