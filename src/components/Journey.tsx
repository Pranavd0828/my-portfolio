'use client';

import { motion } from 'framer-motion';

const caseStudies = [
    {
        company: 'Rakuten',
        timeframe: 'May 2021 - Present',
        roles: [
            {
                id: '01',
                title: 'Unified Campaign Command Center',
                role: 'Senior Product Manager',
                year: 'Feb 2022 - Present',
                description: 'Architected the backend logic to centralize advertiser inputs, reducing booking time by 25%. Built AI agents via LangChain for brand safety compliance.',
            },
            {
                id: '02',
                title: 'Premium Ad Formats & Inventory',
                role: 'Product Manager',
                year: 'May 2021 - Feb 2022',
                description: 'Optimized rendering logic for high-impact display placements, validating a 32% engagement lift. Leveraged journey signals to drive a 19% CPM increase.',
            }
        ]
    },
    {
        company: 'LeanData',
        timeframe: 'August 2020 - May 2021',
        roles: [
            {
                id: '03',
                title: 'Advertiser Entity Engine',
                role: 'Product Manager',
                year: 'Aug 2020 - May 2021',
                description: 'Spearheaded an entity engine optimizing onboarding workflows to map fragmented hierarchical structures into unified account models.',
            }
        ]
    },
    {
        company: 'Media.net',
        timeframe: 'August 2017 - July 2019',
        roles: [
            {
                id: '04',
                title: 'Display/Video Yield Strategy',
                role: 'Product Analyst',
                year: 'Aug 2017 - Jul 2019',
                description: 'Analyzed brand campaign workflows across video and display, translating complex AdTech specifications (VAST/VPAID) into scalable engineering requirements.',
            }
        ]
    }
];

export default function Journey() {
    return (
        <section className="relative w-full min-h-screen py-32 px-6 flex flex-col justify-center">

            {/* Unified Cinematic Background - Replacing the jarring image swaps */}
            <div className="absolute inset-0 z-0 select-none overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-background/95 backdrop-blur-[10px] z-10" />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] rounded-full blur-[100px] opacity-20"
                    animate={{
                        scale: [1, 1.1, 1],
                        background: ['radial-gradient(circle, rgba(100,100,100,0.8) 0%, rgba(0,0,0,0) 80%)', 'radial-gradient(circle, rgba(150,150,150,0.5) 0%, rgba(0,0,0,0) 80%)', 'radial-gradient(circle, rgba(100,100,100,0.8) 0%, rgba(0,0,0,0) 80%)']
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                />
            </div>

            <div className="relative z-10 max-w-6xl w-full mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24">
                    <h2 className="font-serif text-5xl md:text-7xl text-accent">Selected<br />Works</h2>
                    <p className="font-sans text-muted max-w-sm mt-6 md:mt-0">
                        A curated timeline of platform-defining product launches focusing on data scalability and algorithmic intelligence.
                    </p>
                </div>

                <div className="flex flex-col border-t border-white/10">
                    {caseStudies.map((companyBlock, idx) => (
                        <div key={idx} className="flex flex-col py-16 border-b border-white/5 relative group">
                            {/* Company Header */}
                            <div className="flex items-baseline justify-between mb-12">
                                <h3 className="font-serif text-4xl text-accent">{companyBlock.company}</h3>
                                <span className="font-mono text-xs text-muted tracking-widest uppercase">{companyBlock.timeframe}</span>
                            </div>

                            {/* Roles inside Company */}
                            <div className="flex flex-col gap-12 pl-0 md:pl-16 relative">
                                {/* Vertical connection line for multiple roles */}
                                {companyBlock.roles.length > 1 && (
                                    <div className="absolute left-[15px] top-6 bottom-6 w-[1px] bg-white/10 hidden md:block" />
                                )}

                                {companyBlock.roles.map((role, roleIdx) => (
                                    <div key={role.id} className="flex flex-col md:flex-row justify-between group/role relative">
                                        {companyBlock.roles.length > 1 && (
                                            <div className="absolute left-[-45px] top-4 w-2 h-2 rounded-full bg-white/20 group-hover/role:bg-accent transition-colors hidden md:block" />
                                        )}

                                        <div className="flex-1 md:pr-12">
                                            <div className="flex items-center gap-4 mb-3">
                                                <span className="text-xs font-mono text-muted">{role.id}</span>
                                                <span className="text-xs uppercase tracking-widest px-3 py-1 border border-white/10 rounded-full text-accent bg-white/5 group-hover/role:bg-white/10 group-hover/role:border-white/30 transition-all">
                                                    {role.role}
                                                </span>
                                            </div>
                                            <h4 className="font-serif text-2xl md:text-3xl text-accent group-hover/role:text-white transition-colors">{role.title}</h4>
                                        </div>

                                        <div className="flex-1 md:pl-8 mt-4 md:mt-0 flex flex-col md:items-end md:text-right">
                                            <p className="text-muted text-sm md:text-base max-w-md group-hover/role:text-accent/90 transition-colors">
                                                {role.description}
                                            </p>
                                            <span className="text-xs font-sans text-muted/50 mt-3">{role.year}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
