'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LoadingContextType {
    isLoaded: boolean;
    setIsLoaded: (v: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
    isLoaded: false,
    setIsLoaded: () => { },
});

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoaded, setIsLoaded] = useState(false);

    // Provide an escape hatch: if the component doesn't mount for some reason, ensure the site eventually loads.
    // Or, we handle this strictly in the Preloader logic.
    // Let's rely on the Preloader component to call setIsLoaded.

    return (
        <LoadingContext.Provider value={{ isLoaded, setIsLoaded }}>
            {children}
        </LoadingContext.Provider>
    );
}
