'use client';

import { useState } from 'react';
import MagneticButton from './MagneticButton';

export default function ConnectSection() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const subject = encodeURIComponent(`[${name}] contacted you`);
        const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
        window.location.href = `mailto:deopranav2808.work@gmail.com?subject=${subject}&body=${body}`;
    };

    return (
        <section className="w-full min-h-screen py-16 md:py-32 px-6 flex flex-col items-center justify-center relative overflow-hidden">

            {/* Soft glowing ambient light for connect section */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl w-full z-10 text-center flex flex-col items-center">
                <h2 className="font-serif text-6xl md:text-8xl text-accent mb-6">Let&apos;s talk</h2>
                <p className="font-sans text-muted mb-16 max-w-lg">
                    Whether you have a strategic product vision or a complex engineering challenge, my inbox is always open.
                </p>

                <form className="w-full flex flex-col gap-6 items-center" onSubmit={handleSubmit}>
                    <div className="w-full flex flex-col md:flex-row gap-6">
                        <input
                            type="text"
                            required
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-transparent border-b border-white/10 py-4 px-2 text-accent focus:outline-none focus:border-white/50 transition-colors"
                        />
                        <input
                            type="email"
                            required
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b border-white/10 py-4 px-2 text-accent focus:outline-none focus:border-white/50 transition-colors"
                        />
                    </div>
                    <textarea
                        placeholder="Message"
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-transparent border-b border-white/10 py-4 px-2 text-accent focus:outline-none focus:border-white/50 transition-colors resize-none mb-8"
                    />

                    <MagneticButton type="submit" className="px-12 py-4 bg-white text-background hover:bg-white/90 font-medium">
                        Send Message
                    </MagneticButton>
                </form>

                <div className="flex gap-8 mt-32 text-xs font-mono uppercase tracking-widest text-muted">
                    <a href="https://linkedin.com/in/pranav-deo" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">LinkedIn</a>
                    <a href="mailto:deopranav2808.work@gmail.com" className="hover:text-accent transition-colors">Email</a>
                    <a href="https://github.com/Pranavd0828" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
                </div>
            </div>
        </section>
    );
}
