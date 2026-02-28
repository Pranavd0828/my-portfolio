'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Choice = 'ROCK' | 'PAPER' | 'SCISSORS' | 'LIZARD' | 'SPOCK';
type Result = 'VICTORY' | 'DEFEAT' | 'DRAW' | null;

const CHOICES: Choice[] = ['ROCK', 'PAPER', 'SCISSORS', 'LIZARD', 'SPOCK'];

const WIN_MATRIX: Record<Choice, Choice[]> = {
    ROCK: ['SCISSORS', 'LIZARD'],
    PAPER: ['ROCK', 'SPOCK'],
    SCISSORS: ['PAPER', 'LIZARD'],
    LIZARD: ['SPOCK', 'PAPER'],
    SPOCK: ['SCISSORS', 'ROCK']
};

const VERBS: Record<string, string> = {
    'ROCK-SCISSORS': 'crushes',
    'ROCK-LIZARD': 'crushes',
    'PAPER-ROCK': 'covers',
    'PAPER-SPOCK': 'disproves',
    'SCISSORS-PAPER': 'cuts',
    'SCISSORS-LIZARD': 'decapitates',
    'LIZARD-SPOCK': 'poisons',
    'LIZARD-PAPER': 'eats',
    'SPOCK-SCISSORS': 'smashes',
    'SPOCK-ROCK': 'vaporizes'
};

const ICONS: Record<Choice, React.ReactNode> = {
    ROCK: (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 25,80 L 70,80 L 85,45 L 60,20 L 30,25 L 15,50 Z" />
            <path d="M 15,50 L 50,50 L 85,45" />
            <path d="M 50,50 L 60,80" />
            <path d="M 50,50 L 60,20" />
            <path d="M 50,50 L 30,25" />
        </svg>
    ),
    PAPER: (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 30,15 L 60,15 L 80,35 L 80,85 L 30,85 Z" />
            <path d="M 60,15 L 60,35 L 80,35" />
            <line x1="45" y1="45" x2="65" y2="45" />
            <line x1="45" y1="55" x2="65" y2="55" />
            <line x1="45" y1="65" x2="55" y2="65" />
        </svg>
    ),
    SCISSORS: (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="35" cy="75" r="14" />
            <circle cx="65" cy="75" r="14" />
            <path d="M43 65 L80 20 L85 25 L50 50" />
            <path d="M57 65 L20 20 L15 25 L50 50" />
            <circle cx="50" cy="55" r="3" fill="currentColor" />
        </svg>
    ),
    LIZARD: (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 75,20 C 80,15 88,20 85,27 C 80,35 70,35 65,45 C 60,55 65,65 55,75 C 40,90 20,95 10,100 C 10,100 25,90 35,75 C 45,60 45,50 50,40 C 55,30 65,25 75,20 Z" />
            <path d="M 70,30 C 65,25 60,30 55,25" />
            <path d="M 55,35 C 45,33 40,40 35,35" />
            <path d="M 64,49 C 75,49 80,55 85,50" />
            <path d="M 52,57 C 40,60 35,50 25,55" />
            <circle cx="78" cy="23" r="1.5" fill="currentColor" stroke="none" />
        </svg>
    ),
    SPOCK: (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 72,70 L 82,38 C 84,33 90,35 88,40 L 75,72" />
            <path d="M 65,65 L 72,25 C 74,20 80,22 78,27 L 68,68" />
            <path d="M 52,60 L 52,15 C 52,10 58,10 58,15 L 58,62" />
            <path d="M 44,55 L 42,18 C 41,13 47,12 48,17 L 52,60" />
            <path d="M 32,65 L 18,52 C 14,48 20,44 25,48 L 38,62" />
            <path d="M 75,72 C 75,90 60,95 45,95 C 30,95 28,85 32,65 Z" />
        </svg>
    )
};

const WITTY_PHRASES = [
    "I UNDERSTAND THE RISKS",
    "INITIATE COMBAT PROTOCOL",
    "ACCEPT INEVITABLE DEFEAT",
    "I AM FEELING LUCKY",
    "COMMENCE THE DUEL",
    "BRING ON THE MACHINES",
    "ENTER THE CRUCIBLE",
    "PROCEED TO ARENA",
    "LET'S PLAY A GAME",
    "I AM READY"
];

export default function RpslsGame() {
    const [hasStarted, setHasStarted] = useState(false);
    const [entryPhrase, setEntryPhrase] = useState("AWAITING INITIALIZATION...");
    const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
    const [houseChoice, setHouseChoice] = useState<Choice | null>(null);
    const [result, setResult] = useState<Result>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [scrambleChar, setScrambleChar] = useState('X');
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);

        // Pick a random witty phrase on client mount to avoid hydration mismatch
        setEntryPhrase(WITTY_PHRASES[Math.floor(Math.random() * WITTY_PHRASES.length)]);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Scramble effect during calculation
    useEffect(() => {
        if (!isCalculating) return;
        const interval = setInterval(() => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
            setScrambleChar(chars.charAt(Math.floor(Math.random() * chars.length)));
        }, 50);

        return () => clearInterval(interval);
    }, [isCalculating]);

    const handleSelect = (choice: Choice) => {
        if (playerChoice) return; // Prevent double clicks
        setPlayerChoice(choice);
        setIsCalculating(true);

        // Cinematic tension delay
        setTimeout(() => {
            const house = CHOICES[Math.floor(Math.random() * CHOICES.length)];
            setHouseChoice(house);
            setIsCalculating(false);

            // Determine winner
            if (choice === house) {
                setResult('DRAW');
            } else if (WIN_MATRIX[choice].includes(house)) {
                setResult('VICTORY');
            } else {
                setResult('DEFEAT');
            }
        }, 2000); // 2 second tension hold
    };

    const resetGame = () => {
        setPlayerChoice(null);
        setHouseChoice(null);
        setResult(null);
        setIsCalculating(false);
    };

    const getVerb = () => {
        if (!playerChoice || !houseChoice || result === 'DRAW') return 'matches';
        if (result === 'VICTORY') return VERBS[`${playerChoice}-${houseChoice}`];
        return VERBS[`${houseChoice}-${playerChoice}`];
    };

    if (windowSize.width === 0) return <section className="w-full min-h-[100dvh] bg-background" />;

    const isMobile = windowSize.width < 768;
    const radiusX = isMobile ? 120 : 250;
    const radiusY = isMobile ? 150 : 200;

    const getCoordinates = (index: number) => {
        const angle = (index * 72 - 90) * (Math.PI / 180);
        return {
            x: Math.cos(angle) * radiusX,
            y: Math.sin(angle) * radiusY,
            angle
        };
    };

    const pentagonPoints = CHOICES.map((_, i) => `${getCoordinates(i).x + radiusX},${getCoordinates(i).y + radiusY}`).join(' ');

    const getPlayerPos = () => isMobile ? { x: 0, y: -220, scale: 1.2, opacity: 1 } : { x: -300, y: 0, scale: 1.5, opacity: 1 };
    const getHousePos = () => isMobile ? { x: 0, y: 220, scale: 1.2, opacity: 1 } : { x: 300, y: 0, scale: 1.5, opacity: 1 };

    return (
        <section className="relative w-full min-h-[100dvh] h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-background text-foreground px-4 md:px-6">

            {/* Cinematic Initialization Overlay */}
            <AnimatePresence>
                {!hasStarted && (
                    <motion.div
                        initial={{ opacity: 1, pointerEvents: 'auto' }}
                        exit={{ opacity: 0, scale: 1.05, pointerEvents: 'none' }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background px-4 md:px-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="max-w-3xl w-full flex flex-col items-center justify-center min-h-[100dvh]"
                        >
                            <div className="font-mono text-[10px] md:text-xs text-muted/60 uppercase tracking-[0.2em] mb-12 flex flex-col items-center gap-1">
                                <span>SYS.DUEL.V1</span>
                                <span>AWAITING AUTHORIZATION</span>
                            </div>

                            <p className="font-mono text-sm md:text-lg text-white/50 text-center uppercase tracking-[0.1em] md:tracking-[0.2em] leading-relaxed md:leading-loose flex flex-col items-center gap-3 md:gap-5 mb-20 px-2 md:px-0">
                                <span>"Scissors cuts Paper. Paper covers Rock. Rock crushes Lizard.</span>
                                <span>Lizard poisons Spock. Spock smashes Scissors. Scissors decapitates Lizard.</span>
                                <span>Lizard eats Paper. Paper disproves Spock. Spock vaporizes Rock.</span>
                                <span className="text-white mt-4 md:mt-6 font-mono text-2xl md:text-4xl tracking-[0.1em] normal-case drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">And as it always has,<br className="md:hidden" /> Rock crushes Scissors."</span>
                            </p>

                            <motion.button
                                onClick={() => setHasStarted(true)}
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-4 border border-white/20 hover:border-white/60 text-white/90 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] transition-all duration-300 rounded-sm"
                            >
                                [ {entryPhrase} ]
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0 select-none overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-background/95 backdrop-blur-[10px] z-10" />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] rounded-full blur-[100px] opacity-10"
                    animate={{
                        scale: [1, 1.05, 1],
                        background: ['radial-gradient(circle, rgba(200,200,200,0.8) 0%, transparent 80%)', 'radial-gradient(circle, rgba(100,100,100,0.5) 0%, transparent 80%)', 'radial-gradient(circle, rgba(200,200,200,0.8) 0%, transparent 80%)']
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                />
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center h-full flex-1 justify-center">

                {/* Return to Index Header */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-center text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-muted/60 z-20">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="hover:text-white transition-colors duration-300 relative z-20"
                    >
                        [ ABORT_TO_INDEX ]
                    </button>
                    <span>SYS.DUEL.V1</span>
                </div>

                {/* Main Interactive Arena */}
                <div className="relative w-full flex-1 flex items-center justify-center min-h-[400px]">

                    {/* The Background Pentagon Graphic Removed */}

                    {/* Central Initiation Text */}
                    <AnimatePresence>
                        {!playerChoice && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, filter: 'blur(10px)' }}
                                className="absolute flex flex-col items-center justify-center pointer-events-none"
                            >
                                <span className="font-mono text-xl md:text-4xl tracking-widest text-white mb-2 md:mb-3 uppercase">INITIATE</span>
                                <span className="font-mono text-[9px] md:text-xs tracking-[0.4em] uppercase text-white/70">AWAITING INPUT</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* The 5 Geometric Protocol Buttons */}
                    {CHOICES.map((choice, i) => {
                        const coords = getCoordinates(i);
                        const isSelected = playerChoice === choice;
                        const isUnselected = playerChoice && !isSelected;

                        const targetPos = playerChoice
                            ? (isSelected ? getPlayerPos() : { x: coords.x, y: coords.y, scale: 0, opacity: 0 })
                            : { x: coords.x, y: coords.y, scale: 1, opacity: 1 };

                        return (
                            <motion.button
                                key={choice}
                                onClick={() => handleSelect(choice)}
                                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                                animate={{
                                    x: targetPos.x,
                                    y: targetPos.y,
                                    scale: targetPos.scale,
                                    opacity: targetPos.opacity
                                }}
                                whileHover={!playerChoice ? { scale: 1.05 } : {}}
                                whileTap={!playerChoice ? { scale: 0.95 } : {}}
                                className={`absolute flex flex-col items-center justify-center rounded-full border bg-background/80 backdrop-blur-md outline-none
                                    ${isSelected ? 'border-white text-white shadow-[0_0_40px_rgba(255,255,255,0.4)] z-30' : 'border-white/30 text-white/50 hover:text-white hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] z-20'}
                                    ${isUnselected ? 'pointer-events-none' : 'cursor-pointer'}
                                `}
                                style={{
                                    width: isMobile ? '64px' : '100px',
                                    height: isMobile ? '64px' : '100px',
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                disabled={!!playerChoice}
                            >
                                <div className={`${isMobile ? 'w-8 h-8' : 'w-11 h-11'} transition-colors duration-500`}>
                                    {ICONS[choice]}
                                </div>
                                {!playerChoice && (
                                    <span
                                        className="absolute font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-white/50 text-center whitespace-nowrap"
                                        style={{
                                            top: '50%',
                                            left: '50%',
                                            transform: `translate(calc(-50% + ${Math.cos(coords.angle) * (isMobile ? 65 : 90)}px), calc(-50% + ${Math.sin(coords.angle) * (isMobile ? 65 : 90)}px))`
                                        }}
                                    >
                                        {choice}
                                    </span>
                                )}
                            </motion.button>
                        );
                    })}

                    {/* The House (Opponent) Icon Drop-in */}
                    <AnimatePresence>
                        {playerChoice && (
                            <motion.div
                                initial={{ x: isMobile ? 0 : 50, y: isMobile ? 50 : 0, scale: 0, opacity: 0 }}
                                animate={{
                                    x: getHousePos().x,
                                    y: getHousePos().y,
                                    scale: getHousePos().scale,
                                    opacity: 1
                                }}
                                transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 }}
                                className={`absolute flex flex-col items-center justify-center rounded-full border-[0.5px] bg-background/50 backdrop-blur-md outline-none z-20 pointer-events-none
                                    ${houseChoice ? 'border-accent text-accent shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 'border-dashed border-white/30 text-white/50'}
                                `}
                                style={{
                                    width: isMobile ? '76px' : '110px',
                                    height: isMobile ? '76px' : '110px',
                                }}
                            >
                                <div className={`${isMobile ? 'w-10 h-10' : 'w-14 h-14'} flex items-center justify-center`}>
                                    {houseChoice ? ICONS[houseChoice] : (
                                        <span className="font-mono text-xl md:text-2xl font-bold uppercase tracking-widest">{scrambleChar}</span>
                                    )}
                                </div>
                                <span className={`absolute ${isMobile ? '-top-[32px]' : '-bottom-[36px]'} font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-white/50 text-center pointer-events-none whitespace-nowrap`}>
                                    {houseChoice ? `SYS_${houseChoice}` : 'CALCULATING...'}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Central Resolution Text Display */}
                    <AnimatePresence>
                        {houseChoice && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, filter: 'blur(5px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute flex flex-col items-center justify-center w-[80vw] md:w-[400px] z-10"
                            >
                                <div className="flex flex-col items-center justify-center p-8 bg-background/40 backdrop-blur-xl border border-white/5 rounded-2xl w-full shadow-2xl">
                                    <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] text-muted/80 uppercase mb-4 text-center whitespace-nowrap">
                                        {playerChoice} {getVerb()} {houseChoice}
                                    </span>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center"
                                    >
                                        <h2 className="font-mono text-4xl md:text-5xl lg:text-6xl text-white tracking-[0.2em] uppercase mb-10 text-center drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                            {result}
                                        </h2>
                                    </motion.div>    <button
                                        onClick={resetGame}
                                        className="px-6 py-3 border border-white/20 hover:border-white/60 hover:text-white bg-white/5 hover:bg-white/10 font-mono text-[10px] md:text-xs text-muted uppercase tracking-[0.3em] transition-all duration-300 active:scale-95 rounded-sm"
                                    >
                                        [ REINITIALIZE ]
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </section>
    );
}
