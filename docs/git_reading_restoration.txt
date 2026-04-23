'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type Year = '2026' | '2025' | '2024';

interface Book {
    title: string;
    author: string;
    status: 'Read' | 'Reading' | 'Planned';
    coverUrl?: string;
}

const readingData: Record<Year, Book[]> = {
    '2026': [
        { title: 'Nexus', author: 'Yuval Noah Harari', status: 'Read', coverUrl: '/covers/nexus.jpg' },
        { title: 'Dune Messiah', author: 'Frank Herbert', status: 'Read', coverUrl: '/covers/dune_messiah.jpg' },
        { title: 'The Body', author: 'Bill Bryson', status: 'Read', coverUrl: '/covers/the_body.jpg' } // Note: 3rd Read-through
    ],
    '2025': [
        { title: 'The Three-Body Problem', author: 'Cixin Liu', status: 'Read', coverUrl: '/covers/three_body.jpg' },
        { title: 'The Dark Forest', author: 'Cixin Liu', status: 'Read', coverUrl: '/covers/dark_forest.jpg' },
        { title: 'Death\'s End', author: 'Cixin Liu', status: 'Read', coverUrl: '/covers/deaths_end.jpg' },
        { title: 'A Short History of Nearly Everything', author: 'Bill Bryson', status: 'Read', coverUrl: '/covers/short_history.jpg' },
        { title: 'The Wager', author: 'David Grann', status: 'Read', coverUrl: '/covers/the_wager.jpg' },
        { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', status: 'Read' },
        { title: 'Recursion', author: 'Blake Crouch', status: 'Read', coverUrl: '/covers/recursion.jpg' },
        { title: 'Dark Matter', author: 'Blake Crouch', status: 'Read', coverUrl: '/covers/dark_matter.jpg' },
        { title: 'Project Hail Mary', author: 'Andy Weir', status: 'Read', coverUrl: '/covers/project_hail_mary.jpg' },
        { title: 'The Psychology of Money', author: 'Morgan Housel', status: 'Read', coverUrl: '/covers/psychology_money.jpg' },
        { title: 'Decode and Conquer', author: 'Lewis C. Lin', status: 'Read', coverUrl: '/covers/decode_conquer.jpg' },
        { title: 'Rock Paper Scissors', author: 'Alice Feeney', status: 'Read', coverUrl: '/covers/rock_paper_scissors.jpg' },
        { title: 'The Word is Murder', author: 'Anthony Horowitz', status: 'Read', coverUrl: '/covers/word_is_murder.jpg' }
    ],
    '2024': [
        { title: 'The Silent Patient', author: 'Alex Michaelides', status: 'Read', coverUrl: '/covers/silent_patient.jpg' },
        { title: 'The Guest List', author: 'Lucy Foley', status: 'Read', coverUrl: '/covers/guest_list.jpg' },
        { title: 'The Kind Worth Killing', author: 'Peter Swanson', status: 'Read', coverUrl: '/covers/kind_worth_killing.jpg' },
        { title: 'Close to Home', author: 'Cara Hunter', status: 'Read' },
        { title: 'The Decagon House Murders', author: 'Yukito Ayatsuji', status: 'Read', coverUrl: '/covers/decagon_house.jpg' },
        { title: 'A Good Girl\'s Guide to Murder', author: 'Holly Jackson', status: 'Read', coverUrl: '/covers/good_girls_guide.jpg' },
        { title: 'Good Girl, Bad Blood', author: 'Holly Jackson', status: 'Read' },
        { title: 'As Good As Dead', author: 'Holly Jackson', status: 'Read', coverUrl: '/covers/as_good_as_dead.jpg' },
        { title: 'Norse Mythology', author: 'Neil Gaiman', status: 'Read', coverUrl: '/covers/norse_mythology.jpg' },
        { title: 'The Catcher in the Rye', author: 'J.D. Salinger', status: 'Read' },
        { title: 'Rework', author: 'Jason Fried', status: 'Read', coverUrl: '/covers/rework.jpg' },
        { title: 'All Good People Here', author: 'Ashley Flowers', status: 'Read', coverUrl: '/covers/all_good_people.jpg' },
        { title: 'Finlay Donovan is Killing It', author: 'Elle Cosimano', status: 'Read', coverUrl: '/covers/finlay_donovan.jpg' },
        { title: 'A Haunting in Venice', author: 'Agatha Christie', status: 'Read' },
        { title: 'The Feeling Economy', author: 'Roland T. Rust', status: 'Read' }
    ]
};

export default function ReadingList() {
    const [activeYear, setActiveYear] = useState<Year>('2026');
    const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
    const years: Year[] = ['2026', '2025', '2024'];

    const handleBookTap = (id: string, e: React.MouseEvent) => {
        // Toggle if on touch device / small screen
        if (window.innerWidth < 1024) {
            setExpandedBookId(expandedBookId === id ? null : id);
        }
    };

    return (
        <section className="w-full max-w-6xl mx-auto py-16 md:py-32 px-6">
            <div className="flex flex-col mb-16">
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-8">
                    <div>
                        <h2 className="font-serif text-3xl leading-tight md:text-5xl lg:text-7xl md:leading-none text-accent">Literature</h2>
                        <p className="font-sans text-sm md:text-base text-muted uppercase tracking-[0.2em] mt-6">
                            Index &amp; Study
                        </p>
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
                                    <span className="font-medium">03 Books Completed (Current Year)</span> - A strategic mix of biological endurance analysis, behavioral psychology, and foundational science fiction. <br />
                                    <span className="text-muted mt-2 block">* Including a 3rd distinct read-through of Bill Bryson's 'The Body'.</span>
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
                            <div className="hidden md:grid grid-cols-[1fr_auto] gap-8 pb-4 border-b border-white/10 text-xs font-mono uppercase tracking-widest text-muted/50">
                                <span>Title</span>
                                <span className="text-right">Author</span>
                            </div>

                            {/* Book Rows */}
                            {readingData[activeYear].map((book, idx) => {
                                const bookId = `${activeYear}-${idx}`;
                                return (
                                    <div
                                        key={idx}
                                        onClick={(e) => handleBookTap(bookId, e)}
                                        className="relative flex flex-col pt-6 pb-6 border-b border-white/5 group hover:border-white/20 transition-colors active:bg-white/[0.02] md:active:bg-transparent cursor-pointer lg:cursor-default w-full"
                                    >
                                        <div className="flex items-start md:items-center justify-between gap-4 md:gap-6 z-10 w-full md:flex-row flex-col">

                                            <div className="flex items-start md:items-center gap-4 md:gap-6 w-full">
                                                <div className={`w-1.5 h-1.5 rounded-full mt-2.5 md:mt-0 flex-shrink-0 transition-all duration-300 ${expandedBookId === bookId ? 'bg-accent shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-white/20 group-hover:bg-accent group-hover:shadow-[0_0_10px_rgba(255,255,255,0.8)]'}`} />
                                                <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-1 md:gap-8">
                                                    <h4 className={`font-serif text-xl md:text-2xl transition-colors duration-300 ${expandedBookId === bookId ? 'text-white' : 'text-accent group-hover:text-white'}`}>
                                                        {book.title}
                                                    </h4>
                                                    <div className={`text-sm md:text-base font-sans md:text-right transition-colors duration-300 ${expandedBookId === bookId ? 'text-accent' : 'text-muted group-hover:text-accent'}`}>
                                                        {book.author}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        {/* Mobile/Inline Cover Art - Tap to reveal */}
                                        <AnimatePresence>
                                            {book.coverUrl && expandedBookId === bookId && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    className="w-full lg:hidden overflow-hidden pl-5 md:pl-7"
                                                >
                                                    <div className="relative w-28 aspect-[2/3] rounded-lg shadow-lg overflow-hidden border border-white/10">
                                                        <Image src={book.coverUrl} alt={book.title} fill className="object-cover" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Optional Hover Cover Art Overlay */}
                                        {book.coverUrl && (
                                            <div className="pointer-events-none fixed top-1/2 left-3/4 -translate-y-1/2 -translate-x-1/2 z-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-[0.22,1,0.36,1] scale-90 group-hover:scale-110 rotate-3 group-hover:-rotate-3 mix-blend-screen hidden lg:block">
                                                <div className="relative w-48 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl opacity-40">
                                                    <Image
                                                        src={book.coverUrl}
                                                        alt={book.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
