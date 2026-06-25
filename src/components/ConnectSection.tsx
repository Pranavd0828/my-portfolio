'use client';

import { useState } from 'react';

export default function ConnectSection() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            // Submit to the actual Formspree endpoint
            const response = await fetch('https://formspree.io/f/mzdlepvr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, message })
            });

            if (response.ok) {
                setStatus('success');
                setName('');
                setEmail('');
                setMessage('');
                // Reset back to idle after a few seconds
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 5000);
            }
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <section id="connect" className="w-full min-h-screen py-16 md:py-32 px-6 flex flex-col items-center justify-center relative overflow-hidden">

            {/* Soft glowing ambient light for connect section */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl w-full z-10 text-center flex flex-col items-center">
                <h2 className="font-serif text-5xl leading-tight md:text-8xl md:leading-none text-white mb-6">Get in touch</h2>
                <p className="font-serif text-white/70 mb-4 max-w-lg text-lg">
                    Open to senior PM roles at the intersection of AI, platform, and data. Also happy to talk prototypes, product strategy, or anything in between.
                </p>
                <div className="flex flex-col gap-1 mb-12">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                        Based in Sunnyvale, CA
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                        Open to remote and hybrid
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                        Open to relocation
                    </p>
                </div>

                <form className="w-full flex flex-col gap-6 items-center" onSubmit={handleSubmit}>
                    <div className="w-full flex flex-col md:flex-row gap-6">
                        <input
                            type="text"
                            required
                            placeholder="NAME"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={status === 'submitting'}
                            className="w-full bg-transparent border-b border-white/10 py-4 px-2 text-white font-mono text-[10px] md:text-xs uppercase tracking-widest focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/20 disabled:opacity-50"
                        />
                        <input
                            type="email"
                            required
                            placeholder="EMAIL"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === 'submitting'}
                            className="w-full bg-transparent border-b border-white/10 py-4 px-2 text-white font-mono text-[10px] md:text-xs uppercase tracking-widest focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/20 disabled:opacity-50"
                        />
                    </div>
                    <textarea
                        placeholder="MESSAGE"
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={status === 'submitting'}
                        className="w-full bg-transparent border-b border-white/10 py-4 px-2 text-white font-mono text-[10px] md:text-xs uppercase tracking-widest focus:outline-none focus:border-white/50 transition-colors resize-none mb-8 placeholder:text-white/20 disabled:opacity-50"
                    />

                    <button
                        type="submit"
                        disabled={status === 'submitting' || status === 'success'}
                        className="group relative px-12 py-4 border border-white/20 hover:border-white/60 text-white/50 hover:text-white font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] transition-all duration-300 rounded-sm bg-white/5 hover:bg-white/10 overflow-hidden disabled:pointer-events-none"
                    >
                        <span className="relative z-10">
                            {status === 'idle' && '[ SEND_MESSAGE ]'}
                            {status === 'submitting' && '[ SENDING... ]'}
                            {status === 'success' && '[ MESSAGE_SENT! ]'}
                            {status === 'error' && '[ ERROR_TRY_AGAIN ]'}
                        </span>
                        <div className="absolute inset-0 translate-y-[101%] group-hover:translate-y-0 bg-white/5 transition-transform duration-500 ease-out" />
                    </button>
                </form>

                <div className="flex flex-wrap justify-center gap-8 mt-32 text-[10px] font-mono uppercase tracking-widest text-white/30">
                    <a href="https://linkedin.com/in/pranav-deo" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                    <a href="mailto:deopranav2808.work@gmail.com" className="hover:text-white transition-colors">Email</a>
                    <a href="https://github.com/Pranavd0828" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
                </div>
            </div>
        </section>
    );
}
