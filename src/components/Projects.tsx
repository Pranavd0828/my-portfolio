'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import TiltCard from './TiltCard';

const projects = [
    {
        title: 'Google Maps Meet Mode',
        category: 'Product Strategy & Prototype',
        description: 'Conceptualization and prototype of an experiential "Meet Mode" feature designed for Google Maps, streamlining impromptu social coordination.',
        github: 'https://github.com/Pranavd0828/Google-Maps-Meet-Mode',
        demo: 'https://google-maps-meet-mode.vercel.app/'
    },
    {
        title: 'Flappy Eagle',
        category: 'Game Engine & Physics',
        description: 'A premium, cinematic survival experience game overriding standard physics engines with heavy, deliberate micro-interactions and rigorous gravity models.',
        github: 'https://github.com/Pranavd0828/flappy-eagle',
        demo: 'https://pranavd0828.github.io/flappy-eagle/'
    },
    {
        title: 'LinkedIn Messaging Formatting',
        category: 'UI/UX Extension',
        description: 'A browser extension prototype that injects rich text formatting capabilities; like bold, italics, and lists; directly into LinkedIn\'s native messaging interface.',
        github: 'https://github.com/Pranavd0828/LinkedIn-Messaging-with-Formatting-Option',
        demo: 'https://pranavd0828.github.io/LinkedIn-Messaging-with-Formatting-Option/'
    },
    {
        title: 'WhatsApp Regional Voice-Over AI',
        category: 'LLM & Audio Synthesis',
        description: 'End-to-end prototype injecting hyper-local, regional voice-over capabilities directly into WhatsApp using generative AI models.',
        github: 'https://github.com/Pranavd0828/Whatsapp-Regional-Voice-Over-AI',
        demo: 'https://pranavd0828.github.io/Whatsapp-Regional-Voice-Over-AI/'
    },
    {
        title: 'Read with your Crew in Kindle',
        category: 'Social Ideation',
        description: 'A conceptual prototype exploring synchronous, shared-reading experiences and social margin-notes tailored specifically for the Kindle ecosystem.',
        github: 'https://github.com/Pranavd0828/Read-with-your-Crew-in-Kindle',
        demo: 'https://pranavd0828.github.io/Read-with-your-Crew-in-Kindle/'
    },
    {
        title: 'Food Delivery: Post-Cancellation Rescue',
        category: 'Marketplace Optimization',
        description: 'An algorithmic approach to salvaging canceled food delivery orders by dynamically mapping and discounting them to nearby users in real-time.',
        github: 'https://github.com/Pranavd0828/Food-Delivery---Post-Cancellation-Rescue-Offers',
        demo: 'https://pranavd0828.github.io/Food-Delivery---Post-Cancellation-Rescue-Offers/'
    }
];

export default function Projects() {
    return (
        <section className="relative w-full min-h-screen py-16 md:py-32 px-6 flex flex-col justify-center">
            {/* Unified Cinematic Background to match Journey.tsx */}
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
                    <h2 className="font-serif text-3xl leading-tight md:text-5xl lg:text-6xl md:leading-tight text-accent mb-6">Notable Prototypes</h2>
                    <p className="font-sans text-sm md:text-base text-muted/80 leading-relaxed">
                        A collection of experimental engineering projects, AI concept wrappers, and functional prototypes bridging the gap between product vision and technical feasibility.
                    </p>
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2">
                    {projects.map((project, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col p-8 md:p-12 border-[0.5px] border-white/10"
                        >
                            <div className="relative z-10 flex flex-col h-full justify-between opacity-80 hover:opacity-100 transition-opacity duration-1000">
                                <div>
                                    <span className="text-xs font-mono uppercase tracking-widest text-muted">{project.category}</span>
                                    <h3 className="font-serif text-2xl text-accent mt-6 mb-6">{project.title}</h3>
                                    <p className="text-sm text-muted/80 leading-relaxed mb-12">
                                        {project.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-8 mt-4 pt-8 border-t-[0.5px] border-white/10">
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs font-mono uppercase tracking-widest text-muted hover:text-white transition-colors duration-700">
                                        <span>View Code</span>
                                        <svg className="w-4 h-4 ml-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </a>

                                    {project.demo && (
                                        <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs font-mono uppercase tracking-widest text-accent hover:text-white transition-colors duration-700">
                                            <span>Try Yourself</span>
                                            <svg className="w-4 h-4 ml-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
