'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// GAME CONSTANTS
const GRAVITY = 0.5;
const JUMP_FORCE = -10.5;
const BASE_SPEED = 4;
const ACCELERATION = 0.0005;
const MAX_SPEED = 10;
const SPAWN_MIN_RATE = 90; // Frames
const SPAWN_MAX_RATE = 200;
const OBSTACLE_WIDTH = 30;

const DEATH_QUOTES = [
    "The master has failed more times than the beginner has even tried. But wow, you failed fast.",
    "Every setback is a setup for a comeback. Unless you hit another geometric box.",
    "Shoot for the moon. Even if you miss... wait, no, you just crashed.",
    "Success is not final, failure is not fatal. It is the courage to press Spacebar that counts.",
    "Fall seven times, stand up eight. Though your cube is looking pretty bruised.",
    "They say what doesn't kill you makes you stronger. This definitely killed you.",
    "Only those who dare to fail greatly can ever achieve greatly. Congrats on the great failure."
];

const getGroundY = (canvas: HTMLCanvasElement) => {
    // Elevate the ground line on all screens to better center the action.
    // 60% on mobile, 75% on desktop.
    return window.innerWidth < 768 ? canvas.height * 0.6 : canvas.height * 0.75;
};

interface Entity {
    x: number;
    y: number;
    width: number;
    height: number;
    velocity: number;
}

export default function EscapeGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [currentQuote, setCurrentQuote] = useState(DEATH_QUOTES[0]);

    // Detect touch device on mount
    useEffect(() => {
        const checkTouch = () => {
            if (typeof window === 'undefined') return false;
            return (
                'ontouchstart' in window ||
                navigator.maxTouchPoints > 0 ||
                // @ts-ignore
                (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0)
            );
        };
        setIsTouchDevice(checkTouch());
    }, []);

    // Game State Refs mapping to 60fps mutability
    const gameState = useRef({
        player: { x: 100, y: 0, width: 24, height: 24, velocity: 0 } as Entity,
        obstacles: [] as Entity[],
        speed: BASE_SPEED,
        frame: 0,
        score: 0,
        lastSpawnAt: 0,
        isJumping: false,
        rotation: 0 // Track 3D rotation
    });

    const animationRef = useRef<number | null>(null);

    const resetGame = useCallback(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        gameState.current = {
            player: {
                x: 100,
                y: getGroundY(canvas) - 24,
                width: 24,
                height: 24,
                velocity: 0
            },
            obstacles: [],
            speed: BASE_SPEED,
            frame: 0,
            score: 0,
            lastSpawnAt: 0,
            isJumping: false,
            rotation: gameState.current.rotation
        };
        setScore(0);
        setGameOver(false);
        setIsPlaying(true);
    }, []);

    const handleJump = useCallback((e?: React.KeyboardEvent | React.TouchEvent | React.MouseEvent | TouchEvent) => {
        if (e && 'type' in e) {
            if (e.type === 'keydown' && (e as React.KeyboardEvent).code !== 'Space') return;
            // Allow touch and mousedown to inherently pass
        }

        if (gameOver) {
            resetGame();
            return;
        }

        if (!isPlaying) {
            setIsPlaying(true);
            resetGame();
            return;
        }

        const state = gameState.current;
        if (!state.isJumping) {
            state.player.velocity = JUMP_FORCE;
            state.isJumping = true;
        }
    }, [isPlaying, gameOver, resetGame]);

    useEffect(() => {
        // Handle global spacebar press to prevent scrolling
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                handleJump();
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [handleJump]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (!isPlaying && !gameOver) {
                // Initial draw position
                gameState.current.player.y = getGroundY(canvas) - 24;
                draw();
            }
        };

        const draw = () => {
            if (!ctx || !canvas) return;
            const state = gameState.current;

            // Clear Background (Transparent to allow global CanvasBackground to show through)
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Optional: very light tint to match the rpsls depth if needed, but clearRect is cleanest
            // Ground Line (Hairline Museum Aesthetic)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 0.5;
            const groundY = getGroundY(canvas);
            ctx.beginPath();
            ctx.moveTo(0, groundY);
            ctx.lineTo(canvas.width, groundY);
            ctx.stroke();

            // Draw Obstacles (Brutalist Pillars)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 0.5;

            state.obstacles.forEach(obs => {
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
            });

            // Draw Player (Ghost Wireframe / Isometric Cube)
            const p = state.player;

            // 3D rotation projection math
            const size = p.width / 2; // radius
            const cx = p.x + size;
            const cy = p.y + p.height / 2;
            const t = state.rotation;

            // 8 corners of a cube
            const nodes = [
                [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
                [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
            ];

            const edges = [
                [0, 1], [1, 2], [2, 3], [3, 0], // back face
                [4, 5], [5, 6], [6, 7], [7, 4], // front face
                [0, 4], [1, 5], [2, 6], [3, 7]  // connecting edges
            ];

            const cosT = Math.cos(t);
            const sinT = Math.sin(t);
            const cosT2 = Math.cos(t * 0.5); // Slower secondary rotation
            const sinT2 = Math.sin(t * 0.5);

            const projectedNodes = nodes.map(node => {
                let x = node[0];
                let y = node[1];
                let z = node[2];

                // Rotate X
                let y1 = y * cosT - z * sinT;
                let z1 = y * sinT + z * cosT;
                y = y1;
                z = z1;

                // Rotate Y
                let x1 = x * cosT2 - z * sinT2;
                let z2 = x * sinT2 + z * cosT2;
                x = x1;
                z = z2;

                // Simple orthographic projection
                return {
                    x: cx + x * size,
                    y: cy + y * size
                };
            });

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1; // Crisp hairline
            ctx.beginPath();

            edges.forEach(edge => {
                const p1 = projectedNodes[edge[0]];
                const p2 = projectedNodes[edge[1]];
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
            });

            ctx.stroke();
        };

        const checkCollision = () => {
            const p = gameState.current.player;
            for (const obs of gameState.current.obstacles) {
                if (
                    p.x < obs.x + obs.width &&
                    p.x + p.width > obs.x &&
                    p.y < obs.y + obs.height &&
                    p.y + p.height > obs.y
                ) {
                    return true;
                }
            }
            return false;
        };

        let animationFrameId: number;

        const loop = () => {
            if (!isPlaying) return;

            const state = gameState.current;
            state.frame++;
            state.rotation += 0.05; // Continuously rotate cube

            // Physics Update
            state.player.velocity += GRAVITY;
            state.player.y += state.player.velocity;

            // Ground Collision
            const floor = getGroundY(canvas) - state.player.height;
            if (state.player.y > floor) {
                state.player.y = floor;
                state.player.velocity = 0;
                state.isJumping = false;
            }

            // Speed Acceleration
            if (state.speed < MAX_SPEED) {
                state.speed += ACCELERATION;
            }

            // Move Obstacles
            state.obstacles.forEach(obs => {
                obs.x -= state.speed;
            });

            // Remove off-screen obstacles & increment score
            if (state.obstacles.length > 0 && state.obstacles[0].x + state.obstacles[0].width < 0) {
                state.obstacles.shift();
                state.score += 100;
                setScore(Math.floor(state.score));
            }

            // Spawn Obstacles
            const timeSinceLastSpawn = state.frame - state.lastSpawnAt;
            const currentSpawnTarget = SPAWN_MIN_RATE + Math.random() * (SPAWN_MAX_RATE - SPAWN_MIN_RATE);

            if (timeSinceLastSpawn > currentSpawnTarget) {
                const height = 30 + Math.random() * 50;
                const groundY = getGroundY(canvas);
                state.obstacles.push({
                    x: canvas.width,
                    y: groundY - height,
                    width: OBSTACLE_WIDTH,
                    height: height,
                    velocity: 0
                });
                state.lastSpawnAt = state.frame;
            }

            // Collision Detection
            if (checkCollision()) {
                setGameOver(true);
                setIsPlaying(false);
                setHighScore(prev => Math.max(prev, Math.floor(state.score)));
                setCurrentQuote(DEATH_QUOTES[Math.floor(Math.random() * DEATH_QUOTES.length)]);
                draw(); // Draw final frame
                return;
            }

            draw();
            animationFrameId = requestAnimationFrame(loop);
            animationRef.current = animationFrameId;
        };

        window.addEventListener('resize', updateSize);
        updateSize();

        if (isPlaying) {
            animationFrameId = requestAnimationFrame(loop);
            animationRef.current = animationFrameId;
        } else {
            draw();
        }

        return () => {
            window.removeEventListener('resize', updateSize);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [isPlaying, gameOver]);


    return (
        <div
            className="relative w-full h-[100dvh] overflow-hidden cursor-pointer touch-none bg-background/90"
            onPointerDown={handleJump}
        >
            {/* Cinematic Background Layer (Unified with RPSLS) */}
            <div className="absolute inset-0 z-0 select-none overflow-hidden pointer-events-none">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] rounded-full blur-[120px] opacity-[0.03] bg-white pointer-events-none"
                />
            </div>

            <canvas
                ref={canvasRef}
                className="relative z-10 block w-full h-full"
            />

            {/* Highly Visible HUD: Return to Index Link */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = '/';
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute top-6 left-6 md:top-8 md:left-12 px-4 py-2 bg-white/5 border border-white/20 hover:bg-white/10 text-xs font-mono uppercase tracking-[0.2em] text-white/90 transition-all duration-300 z-50 rounded-sm inline-flex items-center gap-2 backdrop-blur-md"
                aria-label="Abort and return to index"
            >
                <span className="text-accent">←</span> <span>ABORT_TO_INDEX</span>
            </button>

            {/* UI Overlay */}
            <div className="absolute top-6 right-6 md:top-8 md:right-12 font-mono text-sm tracking-widest text-muted/50 select-none pointer-events-none flex flex-col items-end gap-1">
                <span>HI {highScore.toString().padStart(5, '0')}</span>
                <span className="text-accent">{score.toString().padStart(5, '0')}</span>
            </div>

            {/* Start Screen */}
            {(!isPlaying && !gameOver) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mix-blend-difference">
                    <span className="font-mono text-4xl md:text-6xl text-white tracking-[0.2em] animate-pulse uppercase">ESCAPE</span>
                    <span className="font-mono text-xs text-muted/70 uppercase tracking-widest mt-6">
                        {isTouchDevice ? 'TAP SCREEN TO INITIATE' : 'PRESS SPACE TO INITIATE'}
                    </span>
                </div>
            )}

            {/* Game Over Screen */}
            {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background backdrop-blur-md pointer-events-auto z-40">
                    <span className="font-mono text-4xl md:text-6xl text-white tracking-[0.2em] uppercase">SIGNAL LOST</span>

                    <span className="font-sans text-sm md:text-base font-medium text-white/90 text-center max-w-[85vw] md:max-w-md mt-8 mb-4">
                        "{currentQuote}"
                    </span>

                    <span className="font-mono text-xs text-accent uppercase tracking-[0.3em] mt-2 mb-10">
                        Final Score: {score}
                    </span>

                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                resetGame();
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="px-6 py-4 md:py-3 border border-white/20 bg-white/5 hover:bg-white/10 font-mono text-xs text-white tracking-[0.2em] transition-all duration-300 rounded-sm"
                        >
                            [ RESTART_SIMULATION ]
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = '/';
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="px-6 py-4 md:py-3 font-mono text-xs text-muted/60 hover:text-white tracking-[0.2em] transition-all duration-300 rounded-sm"
                        >
                            [ ABORT_TO_HOMEPAGE ]
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
