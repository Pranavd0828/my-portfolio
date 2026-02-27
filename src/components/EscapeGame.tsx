'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// GAME CONSTANTS
const GRAVITY = 0.5;
const JUMP_FORCE = -10.5;
const BASE_SPEED = 4;
const ACCELERATION = 0.0005;
const MAX_SPEED = 10;
const SPAWN_MIN_RATE = 90; // Frames
const SPAWN_MAX_RATE = 200;
const OBSTACLE_WIDTH = 30;

const getGroundY = (canvas: HTMLCanvasElement) => {
    // On mobile screens, elevate the ground line to roughly 60% of the viewport height
    // so the game action sits squarely in the middle of the phone screen.
    return window.innerWidth < 768 ? canvas.height * 0.6 : canvas.height - 100;
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

            // Clear Background (Deep Space / Minimalist)
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

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
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();

            edges.forEach(edge => {
                const p1 = projectedNodes[edge[0]];
                const p2 = projectedNodes[edge[1]];
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
            });

            ctx.stroke();
            ctx.shadowBlur = 0; // Reset
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
                state.score += 10;
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
            className="relative w-full h-full overflow-hidden cursor-pointer touch-none"
            onPointerDown={handleJump}
        >
            <canvas
                ref={canvasRef}
                className="block w-full h-full"
            />

            {/* UI Overlay */}
            <div className="absolute top-8 right-12 font-mono text-sm tracking-widest text-muted/50 select-none pointer-events-none flex flex-col items-end gap-1">
                <span>HI {highScore.toString().padStart(5, '0')}</span>
                <span className="text-accent">{score.toString().padStart(5, '0')}</span>
            </div>

            {/* Start / Game Over Screen */}
            {(!isPlaying && !gameOver) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mix-blend-difference">
                    <span className="font-serif text-4xl md:text-6xl text-white tracking-widest animate-pulse">ESCAPE</span>
                    <span className="font-mono text-xs text-muted/70 uppercase tracking-widest mt-6">Press Space to Initiate</span>
                </div>
            )}

            {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
                    <span className="font-serif text-4xl md:text-6xl text-white tracking-widest">SIGNAL LOST</span>
                    <span className="font-mono text-xs text-white/50 uppercase tracking-[0.3em] mt-8 mb-4">Final Score: {score}</span>
                    <span className="font-mono text-xs text-accent uppercase animate-pulse tracking-widest">Press Space to Restart</span>
                </div>
            )}

            {/* Minimalist Watermark/Return Link to maintain ecosystem connection without harsh navbars */}
            <a href="/" className="absolute bottom-8 left-8 text-xs font-mono uppercase tracking-widest text-muted/30 hover:text-white transition-colors duration-500 z-50">
                ← Return to Index
            </a>
        </div>
    );
}
