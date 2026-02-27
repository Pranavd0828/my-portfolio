'use client';

export default function MagneticButton({
    children,
    className = '',
    type = 'button',
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    [key: string]: any;
}) {
    return (
        <button
            type={type}
            className={`relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium border rounded-full group transition-all duration-300 active:scale-[0.98] ${className}`}
            {...props}
        >
            <span className="relative z-10">{children}</span>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </button>
    );
}
