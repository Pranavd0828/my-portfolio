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
                title: 'Revenue Operations Engine',
                role: 'Product Manager',
                year: 'Aug 2020 - May 2021',
                description: 'Spearheaded an entity routing engine optimizing B2B onboarding workflows to map fragmented hierarchical structures into unified revenue account models.',
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
        <section className="relative w-full min-h-screen py-16 md:py-32 px-6 flex flex-col justify-center">

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
                <div className="flex flex-col items-center text-center mb-16 max-w-4xl mx-auto">
                    <h2 className="font-serif text-3xl leading-tight md:text-5xl lg:text-7xl md:leading-none text-white mb-6">Professional Journey</h2>
                    <p className="font-sans text-sm md:text-base text-white/50 leading-relaxed">
                        A curated timeline of platform-defining product launches focusing on data scalability and algorithmic intelligence.
                    </p>
                </div>

                <div className="flex flex-col border-t border-white/10">
                    {caseStudies.map((companyBlock, idx) => (
                        <div key={idx} className="flex flex-col py-16 md:py-24 border-b border-white/5 relative group">
                            {/* Company Header */}
                            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-12 gap-2 md:gap-0">
                                <h3 className="font-serif text-4xl text-white">{companyBlock.company}</h3>
                                <span className="font-mono text-[10px] md:text-xs text-white/30 tracking-widest uppercase">{companyBlock.timeframe}</span>
                            </div>

                            {/* Roles inside Company */}
                            <div className="flex flex-col gap-10 md:gap-12 pl-7 md:pl-16 relative">
                                {/* Vertical connection line for multiple roles */}
                                {companyBlock.roles.length > 1 && (
                                    <div className="absolute left-[11px] md:left-[15px] top-8 bottom-8 w-[1px] bg-white/10" />
                                )}

                                {companyBlock.roles.map((role, roleIdx) => (
                                    <div key={role.id} className="flex flex-col md:flex-row justify-between group/role relative">
                                        {companyBlock.roles.length > 1 && (
                                            <div className="absolute left-[-20px] md:left-[-52px] top-[10px] md:top-[12px] w-[7px] h-[7px] rounded-full bg-white/20 group-hover/role:bg-accent transition-colors" />
                                        )}

                                        <div className="flex-1 md:pr-12">
                                            <div className="flex items-center gap-4 mb-2">
                                                <span className="text-xs font-mono text-muted/60">{role.id}</span>
                                                <h4 className="font-sans text-xl md:text-2xl font-medium tracking-tight text-accent group-hover/role:text-white transition-colors">
                                                    {role.role}
                                                </h4>
                                            </div>
                                            <div className="font-serif text-lg md:text-xl text-white/40 group-hover/role:text-white/70 transition-colors">
                                                {role.title}
                                            </div>
                                        </div>

                                        <div className="flex-1 md:pl-8 mt-4 md:mt-0 flex flex-col md:items-end md:text-right">
                                            <p className="font-serif text-white/50 text-sm md:text-base max-w-md group-hover/role:text-white/90 transition-colors">
                                                {role.description}
                                            </p>
                                            <span className="font-serif text-[10px] text-white/20 mt-3 uppercase tracking-widest">{role.year}</span>
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
