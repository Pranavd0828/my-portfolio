'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchLocalWeather, WeatherCondition } from '@/lib/weather';

interface WeatherEngineProps {
    children: React.ReactNode;
}

type TimeOfDay = 'morning' | 'noon' | 'evening' | 'night';
type ThemeMode = 'light' | 'dark';

export default function WeatherEngine({ children }: WeatherEngineProps) {
    const [weather, setWeather] = useState<WeatherCondition | null>(null);
    const [temp, setTemp] = useState<number | null>(null);
    const [timeBlock, setTimeBlock] = useState<TimeOfDay>('noon');
    const [status, setStatus] = useState<string>('Initializing passive sensors...');
    const [isEngineActive, setIsEngineActive] = useState(true);

    useEffect(() => {
        // 1. Determine Local Time Block instantly
        const hour = new Date().getHours();
        let currentBlock: TimeOfDay = 'night';
        if (hour >= 6 && hour < 12) currentBlock = 'morning';
        else if (hour >= 12 && hour < 17) currentBlock = 'noon';
        else if (hour >= 17 && hour < 21) currentBlock = 'evening';

        setTimeBlock(currentBlock);

        // 2. Fetch Location Passively via IP (Zero Browser Prompts)
        const fetchPassiveWeather = async () => {
            try {
                setStatus('Routing IP coordinates...');
                // Free, zero-auth IP geolocation (No user popup required)
                const ipRes = await fetch('https://ipapi.co/json/');
                if (!ipRes.ok) throw new Error('IP locating failed');
                const ipData = await ipRes.json();

                setStatus(`Atmosphere scan: ${ipData.city}...`);
                const data = await fetchLocalWeather(ipData.latitude, ipData.longitude);

                setWeather(data.condition);
                setTemp(data.tempC);
                setStatus('Engine synced.');
            } catch (err) {
                console.error(err);
                setStatus('Location scan failed. Defaulting to clear.');
                setWeather('clear');
            }
        };

        fetchPassiveWeather();
    }, []);

    // --- Core Thematic Engine Logic ---
    const activeCondition = isEngineActive ? (weather || 'clear') : 'clear';
    const activeTime = isEngineActive ? timeBlock : 'night';

    // Matrix: Is it light mode or dark mode?
    // Rule: Morning & Noon are Light Mode, UNLESS it is raining/storming (then it gets moody/dark).
    const isLightMode = (activeTime === 'morning' || activeTime === 'noon') &&
        !['rain', 'thunderstorm'].includes(activeCondition);

    return (
        <div className={`relative w-full min-h-screen overflow-hidden transition-colors duration-[2000ms] ${isLightMode ? 'light-mode' : 'dark-mode'}`}>
            {/* Global CSS Override Engine */}
            <style dangerouslySetInnerHTML={{
                __html: `
                :root {
                    --background: ${getBackground(activeCondition, isLightMode)};
                    --foreground: ${isLightMode ? '#111111' : '#F4F4F5'};
                    --accent: ${isLightMode ? '#000000' : '#EAEAEB'};
                    --muted: ${isLightMode ? '#6b7280' : '#4F5565'};
                }
                `
            }} />

            {/* Atmospheric Environment Elements (Sun/Gradients) */}
            {isLightMode && activeCondition === 'clear' && (
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-amber-400/10 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />
            )}

            {/* Weather Particles Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-normal">
                <AnimatePresence>
                    {activeCondition === 'rain' && <RainOverlay key="rain" isLightMode={isLightMode} />}
                    {activeCondition === 'snow' && <SnowOverlay key="snow" isLightMode={isLightMode} />}
                    {activeCondition === 'thunderstorm' && <ThunderstormOverlay key="thunder" />}
                </AnimatePresence>
            </div>

            {/* Main Content Payload */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Dev Controller UI */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl text-xs font-mono select-none text-white/90 shadow-2xl">
                <span className="text-white/40 tracking-widest uppercase mb-1">Time x Weather Engine</span>

                <div className="flex gap-4 items-center">
                    <div className="flex flex-col">
                        <span className="text-white/30">Status</span>
                        <span className="text-amber-400">{status}</span>
                    </div>
                </div>

                <div className="flex gap-4 mt-2 justify-end w-full">
                    <div className="flex flex-col border-white/10 pr-4 text-right">
                        <span className="text-white/30">Time</span>
                        <span className="text-white capitalize">{timeBlock}</span>
                    </div>
                    {weather && (
                        <div className="flex flex-col border-l border-white/10 pl-4 text-right">
                            <span className="text-white/30">Condition</span>
                            <span className="text-white capitalize">{weather} {temp && `(${temp}°C)`}</span>
                        </div>
                    )}
                </div>

                <div className="pt-3 mt-3 w-full grid grid-cols-4 gap-1">
                    {['morning', 'noon', 'evening', 'night'].map(t => (
                        <button key={t} onClick={() => { setTimeBlock(t as TimeOfDay); setIsEngineActive(true); }} className={`text-[9px] px-1 py-1 rounded uppercase transition-colors ${timeBlock === t ? 'bg-amber-400/20 text-amber-500' : 'bg-white/5 hover:bg-white/10'}`}>
                            {t.substring(0, 3)}
                        </button>
                    ))}
                </div>

                <div className="mt-1 w-full grid grid-cols-4 gap-1">
                    {['clear', 'cloudy', 'rain', 'snow'].map(c => (
                        <button key={c} onClick={() => { setWeather(c as WeatherCondition); setIsEngineActive(true); }} className={`text-[9px] px-1 py-1 rounded uppercase transition-colors ${weather === c ? 'bg-amber-400/20 text-amber-500' : 'bg-white/5 hover:bg-white/10'}`}>
                            {c.substring(0, 4)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- Dynamic Color Mappings ---
function getBackground(condition: WeatherCondition, isLightMode: boolean): string {
    if (isLightMode) {
        switch (condition) {
            case 'snow': return '#eef2f5'; // Icy bright white
            case 'cloudy': return '#e5e7eb'; // Soft overcast gray
            case 'clear':
            default: return '#f8f9fa'; // Warm morning paper white
        }
    } else {
        switch (condition) {
            case 'rain': return '#090d14'; // Deeper, wetter blue-slate
            case 'snow': return '#0f1115'; // Frosted slate
            case 'thunderstorm': return '#030305'; // Pitch darkness
            case 'cloudy': return '#0a0a0a'; // Standard dark
            case 'clear':
            default: return '#000000'; // Core cinematic black
        }
    }
}


// --- Particle Overlays (Contrast Aware) ---
function RainOverlay({ isLightMode }: { isLightMode: boolean }) {
    const drops = Array.from({ length: 60 }).map((_, i) => ({
        id: i, left: `${Math.random() * 100}%`, duration: 0.4 + Math.random() * 0.4, delay: Math.random() * 2
    }));

    const color = isLightMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)';

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            {drops.map(drop => (
                <motion.div
                    key={drop.id}
                    className="absolute top-0 w-[1px] h-[40px]"
                    style={{ left: drop.left, background: `linear-gradient(to bottom, transparent, ${color})` }}
                    animate={{ y: ['-10vh', '110vh'] }}
                    transition={{ duration: drop.duration, repeat: Infinity, ease: 'linear', delay: drop.delay }}
                />
            ))}
        </motion.div>
    );
}

function SnowOverlay({ isLightMode }: { isLightMode: boolean }) {
    const flakes = Array.from({ length: 50 }).map((_, i) => ({
        id: i, size: 3 + Math.random() * 5, left: `${Math.random() * 100}%`, duration: 4 + Math.random() * 6, delay: Math.random() * -5, xOffset: -20 + Math.random() * 40
    }));

    const color = isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.4)';

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            {flakes.map(flake => (
                <motion.div
                    key={flake.id}
                    className="absolute top-[-5vh] rounded-full blur-[1px]"
                    style={{ left: flake.left, width: flake.size, height: flake.size, backgroundColor: color }}
                    animate={{ y: ['0vh', '110vh'], x: [0, flake.xOffset, 0] }}
                    transition={{
                        y: { duration: flake.duration, repeat: Infinity, ease: 'linear', delay: flake.delay },
                        x: { duration: flake.duration / 2, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse' }
                    }}
                />
            ))}
        </motion.div>
    );
}

function ThunderstormOverlay() {
    return (
        <motion.div className="absolute inset-0 flex pointer-events-none">
            <div className="absolute inset-0 opacity-70"><RainOverlay isLightMode={false} /></div>
            <motion.div
                className="absolute inset-0 bg-white"
                animate={{ opacity: [0, 0, 0, 0, 0.9, 0, 0.5, 0, 0] }}
                transition={{ duration: 8, repeat: Infinity, times: [0, 0.4, 0.41, 0.5, 0.51, 0.53, 0.58, 0.6, 1], ease: "linear" }}
            />
        </motion.div>
    );
}
