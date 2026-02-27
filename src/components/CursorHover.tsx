'use client';

import React from 'react';
import { useCursor } from './CursorContext';

interface CursorHoverProps {
    children: React.ReactNode;
    variant?: 'hover' | 'text' | 'hidden';
    className?: string;
}

export default function CursorHover({ children, variant = 'hover', className = '' }: CursorHoverProps) {
    const { setCursorVariant } = useCursor();

    return (
        <div
            className={`inline-block ${className}`}
            onMouseEnter={() => setCursorVariant(variant)}
            onMouseLeave={() => setCursorVariant('default')}
        >
            {children}
        </div>
    );
}
