'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type Year = '2026' | '2025' | '2024';

interface Book {
    title: string;
    author: string;
    status: 'Read' | 'Reading' | 'Planned';
}

const readingData: Record<Year, Book[]> = {
    '2026': [
        { title: 'Nexus', author: 'Yuval Noah Harari', status: 'Read' },
        { title: 'The Three-Body Problem', author: 'Cixin Liu', status: 'Read' },
        { title: 'Dune Messiah', author: 'Frank Herbert', status: 'Read' },
        { title: 'Supercommunicators', author: 'Charles Duhigg', status: 'Read' },
        { title: 'Children of Dune', author: 'Frank Herbert', status: 'Read' },
        { title: 'Hooked', author: 'Nir Eyal', status: 'Read' },
        { title: 'Outlive', author: 'Peter Attia, MD', status: 'Read' },
        { title: 'The Body', author: 'Bill Bryson', status: 'Read' } // Note: 3rd Read-through
    ],
    '2025': [
        { title: 'The Dark Forest', author: 'Cixin Liu', status: 'Read' },
        { title: 'Death\'s End', author: 'Cixin Liu', status: 'Read' },
        { title: 'A Short History of Nearly Everything', author: 'Bill Bryson', status: 'Read' },
        { title: 'The Wager', author: 'David Grann', status: 'Read' },
        { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', status: 'Read' },
        { title: 'Recursion', author: 'Blake Crouch', status: 'Read' },
        { title: 'Dark Matter', author: 'Blake Crouch', status: 'Read' },
        { title: 'Project Hail Mary', author: 'Andy Weir', status: 'Read' },
        { title: 'The Psychology of Money', author: 'Morgan Housel', status: 'Read' },
        { title: 'Decode and Conquer', author: 'Lewis C. Lin', status: 'Read' },
        { title: 'Cracking the PM Interview', author: 'Gayle Laakmann McDowell', status: 'Read' },
        { title: 'A Random Walk Down Wall Street', author: 'Burton G. Malkiel', status: 'Read' },
        { title: 'Buffettology', author: 'Mary Buffett', status: 'Read' },
        { title: 'Rock Paper Scissors', author: 'Alice Feeney', status: 'Read' },
        { title: 'The Word is Murder', author: 'Anthony Horowitz', status: 'Read' }
    ],
    '2024': [
        { title: 'The Silent Patient', author: 'Alex Michaelides', status: 'Read' },
        { title: 'The Guest List', author: 'Lucy Foley', status: 'Read' },
        { title: 'The Kind Worth Killing', author: 'Peter Swanson', status: 'Read' },
        { title: 'Close to Home', author: 'Cara Hunter', status: 'Read' },
        { title: 'The Decagon House Murders', author: 'Yukito Ayatsuji', status: 'Read' },
        { title: 'A Good Girl\'s Guide to Murder', author: 'Holly Jackson', status: 'Read' },
        { title: 'Good Girl, Bad Blood', author: 'Holly Jackson', status: 'Read' },
        { title: 'As Good As Dead', author: 'Holly Jackson', status: 'Read' },
        { title: 'Norse Mythology', author: 'Neil Gaiman', status: 'Read' },
        { title: 'The Catcher in the Rye', author: 'J.D. Salinger', status: 'Read' },
        { title: 'Rework', author: 'Jason Fried', status: 'Read' },
        { title: 'All Good People Here', author: 'Ashley Flowers', status: 'Read' },
        { title: 'Finlay Donovan is Killing It', author: 'Elle Cosimano', status: 'Read' },
        { title: 'A Haunting in Venice', author: 'Agatha Christie', status: 'Read' },
        { title: 'The Feeling Economy', author: 'Roland T. Rust', status: 'Read' }
    ]
};

export default function ReadingList() {
    const [activeYear, setActiveYear] = useState<Year>('2026');
    const years: Year[] = ['2026', '2025', '2024'];

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

            <div className="min-h-[600px] border-t border-white/10 pt-16">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeYear}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col"
                    >
                        {/* Contextual Notes / Headers per year */}
                        {activeYear === '2026' && (
                            <div className="mb-12 pb-6 border-b border-white/5">
                                <p className="font-sans text-sm md:text-base text-accent max-w-3xl leading-relaxed">
                                    <span className="font-medium">07 Books Completed (Current Year)</span> &mdash; A strategic mix of biological endurance analysis, behavioral psychology, and foundational science fiction. <br />
                                    <span className="text-muted italic mt-2 block">* Including a 3rd distinct read-through of Bill Bryson's 'The Body'.</span>
                                </p>
                            </div>
                        )}
                        {activeYear === '2025' && (
                            <div className="mb-12 pb-6 border-b border-white/5">
                                <p className="font-sans text-sm md:text-base text-muted max-w-3xl leading-relaxed">
                                    A high-volume year exploring immense sci-fi scope (<span className="italic">The Remembrance of Earth's Past</span> trilogy) and heavily anchored in Product Management fundamentals.
                                </p>
                            </div>
                        )}
                        {activeYear === '2024' && (
                            <div className="mb-12 pb-6 border-b border-white/5">
                                <p className="font-sans text-sm md:text-base text-muted max-w-3xl leading-relaxed">
                                    A foundation built on psychological thrillers and business philosophy, framing the transition toward advanced AI systems and immersive product strategies.
                                </p>
                            </div>
                        )}

                        {/* Data Grid */}
                        <div className="flex flex-col">
                            {/* Grid Header */}
                            <div className="grid grid-cols-[1fr_auto] gap-8 pb-4 border-b border-white/10 text-xs font-mono uppercase tracking-widest text-muted/50">
                                <span>Title</span>
                                <span className="text-right">Author</span>
                            </div>

                            {/* Book Rows */}
                            {readingData[activeYear].map((book, idx) => (
                                <div
                                    key={idx}
                                    className="grid grid-cols-[1fr_auto] items-center gap-8 py-6 border-b border-white/5 group hover:border-white/20 transition-colors"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-accent group-hover:shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-300" />
                                        <h4 className="font-serif text-xl md:text-2xl text-accent group-hover:text-white transition-colors duration-300">
                                            {book.title}
                                        </h4>
                                    </div>
                                    <div className="text-right text-sm md:text-base font-sans text-muted group-hover:text-accent transition-colors duration-300">
                                        {book.author}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
