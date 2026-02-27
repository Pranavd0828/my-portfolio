'use client';

import React, { createContext, useContext, useState } from 'react';

type CursorVariant = 'default' | 'hover' | 'text' | 'hidden';

interface CursorContextType {
    cursorVariant: CursorVariant;
    setCursorVariant: (variant: CursorVariant) => void;
}

const CursorContext = createContext<CursorContextType>({
    cursorVariant: 'default',
    setCursorVariant: () => { },
});

export const useCursor = () => useContext(CursorContext);

export function CursorProvider({ children }: { children: React.ReactNode }) {
    const [cursorVariant, setCursorVariant] = useState<CursorVariant>('default');

    return (
        <CursorContext.Provider value={{ cursorVariant, setCursorVariant }}>
            {children}
        </CursorContext.Provider>
    );
}
