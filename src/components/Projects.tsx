import Link from 'next/link';

const projects = [
    {
        title: 'Google Maps Meet Mode',
        category: 'Product Strategy & Prototype',
        description: 'Conceptualization and prototype of an experiential "Meet Mode" feature designed for Google Maps, streamlining impromptu social coordination.',
        github: 'https://github.com/Pranavd0828/Google-Maps-Meet-Mode'
    },
    {
        title: 'Flappy Eagle',
        category: 'Game Engine & Physics',
        description: 'A premium, cinematic survival experience game overriding standard physics engines with heavy, deliberate micro-interactions and rigorous gravity models.',
        github: 'https://github.com/Pranavd0828/flappy-eagle'
    },
    {
        title: 'Recall Mode: Anti-Spoiler Context Engine',
        category: 'AI Pipeline',
        description: 'An AI engine designed to process real-time contextual awareness without spoiling narrative events for viewers.',
        github: 'https://github.com/Pranavd0828/Recall-Mode-The-Anti-Spoiler-Context-Engine'
    },
    {
        title: 'WhatsApp Regional Voice-Over AI',
        category: 'LLM & Audio Synthesis',
        description: 'End-to-end prototype injecting hyper-local, regional voice-over capabilities directly into WhatsApp using generative AI models.',
        github: 'https://github.com/Pranavd0828/Whatsapp-Regional-Voice-Over-AI'
    }
];

export default function Projects() {
    return (
        <section className="w-full max-w-6xl mx-auto py-32 px-6">
            <div className="flex flex-col mb-16">
                <h2 className="font-serif text-5xl md:text-6xl text-accent">Notable Prototypes</h2>
                <p className="font-sans text-muted mt-6 max-w-md text-sm md:text-base">
                    A collection of experimental engineering projects, AI concept wrappers, and functional prototypes bridging the gap between product vision and technical feasibility.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, idx) => (
                    <a
                        key={idx}
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500 rounded-lg relative overflow-hidden"
                    >
                        {/* Subtle glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <span className="text-xs font-mono uppercase tracking-widest text-muted">{project.category}</span>
                                <h3 className="font-serif text-2xl text-accent mt-4 mb-4 group-hover:text-white transition-colors">{project.title}</h3>
                                <p className="text-sm text-muted/80 leading-relaxed mb-8 group-hover:text-accent transition-colors">
                                    {project.description}
                                </p>
                            </div>

                            <div className="flex items-center text-xs font-mono uppercase tracking-widest text-accent group-hover:translate-x-2 transition-transform duration-300">
                                <span>View Repository</span>
                                <svg className="w-4 h-4 ml-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
