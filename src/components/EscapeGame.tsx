'use client'
import { useRouter } from 'next/navigation'

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useSyncExternalStore,
} from 'react'

// GAME CONSTANTS
const GRAVITY = 0.5
const JUMP_FORCE = -10.5
const BASE_SPEED = 4
const ACCELERATION = 0.0005
const MAX_SPEED = 10
const SPAWN_MIN_RATE = 90 // Frames
const SPAWN_MAX_RATE = 200
const OBSTACLE_WIDTH = 30

const DEATH_QUOTES = [
  'The master has failed more times than the beginner has even tried. But wow, you failed fast.',
  'Every setback is a setup for a comeback. Unless you hit another geometric box.',
  'Shoot for the moon. Even if you miss... wait, no, you just crashed.',
  'Success is not final, failure is not fatal. It is the courage to press Spacebar that counts.',
  'Fall seven times, stand up eight. Though your cube is looking pretty bruised.',
  'They say what does not kill you makes you stronger. This definitely killed you.',
  'Only those who dare to fail greatly can ever achieve greatly. Congrats on the great failure.',
]

const getGroundY = (width: number, height: number) => {
  // Elevate the ground line on all screens to better center the action.
  // 60% on mobile, 75% on desktop.
  return width < 768 ? height * 0.6 : height * 0.75
}

interface Entity {
  x: number
  y: number
  width: number
  height: number
  velocity: number
}

const getTouch = () => window.matchMedia('(pointer: coarse)').matches
const subscribeTouch = (notify: () => void) => {
  const media = window.matchMedia('(pointer: coarse)')
  media.addEventListener('change', notify)
  return () => media.removeEventListener('change', notify)
}
export default function EscapeGame() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const isTouchDevice = useSyncExternalStore(
    subscribeTouch,
    getTouch,
    () => false
  )
  const [currentQuote, setCurrentQuote] = useState(DEATH_QUOTES[0])

  // Game State Refs mapping to 60fps mutability
  const gameState = useRef({
    player: { x: 100, y: 0, width: 24, height: 24, velocity: 0 } as Entity,
    obstacles: [] as Entity[],
    speed: BASE_SPEED,
    frame: 0,
    score: 0,
    lastSpawnAt: 0,
    isJumping: false,
    rotation: 0, // Track 3D rotation
    groundY: 0,
    canvasWidth: 0,
    canvasHeight: 0,
  })

  const animationRef = useRef<number | null>(null)

  const resetGame = useCallback(() => {
    if (!canvasRef.current) return
    const { canvasWidth, canvasHeight } = gameState.current
    gameState.current = {
      player: {
        x: Math.min(100, canvasWidth * 0.18),
        y: getGroundY(canvasWidth, canvasHeight) - 24,
        width: 24,
        height: 24,
        velocity: 0,
      },
      obstacles: [],
      speed: BASE_SPEED,
      frame: 0,
      score: 0,
      lastSpawnAt: 0,
      isJumping: false,
      rotation: gameState.current.rotation,
      groundY: getGroundY(canvasWidth, canvasHeight),
      canvasWidth,
      canvasHeight,
    }
    setScore(0)
    setGameOver(false)
    setIsPlaying(true)
  }, [])

  const handleJump = useCallback(
    (
      e?:
        | React.KeyboardEvent
        | React.PointerEvent
        | React.TouchEvent
        | React.MouseEvent
        | TouchEvent
    ) => {
      if (e && 'isPrimary' in e && (!e.isPrimary || e.button !== 0)) return
      if (e && 'type' in e) {
        if (e.type === 'keydown' && (e as React.KeyboardEvent).code !== 'Space')
          return
        // Allow touch and mousedown to inherently pass
      }

      if (gameOver) {
        resetGame()
        return
      }

      if (!isPlaying) {
        setIsPlaying(true)
        resetGame()
        return
      }

      const state = gameState.current
      if (!state.isJumping) {
        state.player.velocity = JUMP_FORCE
        state.isJumping = true
      }
    },
    [isPlaying, gameOver, resetGame]
  )

  useEffect(() => {
    // Handle global spacebar press to prevent scrolling
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        !(
          e.target instanceof HTMLElement &&
          e.target.closest('a,button,input,textarea,select,summary')
        )
      ) {
        e.preventDefault()
        handleJump()
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [handleJump])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateSize = () => {
      const width = canvas.parentElement?.clientWidth ?? window.innerWidth
      const height = canvas.parentElement?.clientHeight ?? window.innerHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      const state = gameState.current
      const nextGround = getGroundY(width, height)
      const shift = nextGround - state.groundY
      state.player.y += shift
      state.player.x = Math.min(100, width * 0.18)
      state.obstacles.forEach((obstacle) => {
        obstacle.y += shift
      })
      state.groundY = nextGround
      state.canvasWidth = width
      state.canvasHeight = height

      if (!isPlaying && !gameOver) {
        // Initial draw position
        gameState.current.player.y = gameState.current.groundY - 24
        draw()
      }
    }

    const draw = () => {
      if (!ctx || !canvas) return
      const state = gameState.current

      // Keep the canvas transparent so the page surface remains visible.
      ctx.clearRect(0, 0, state.canvasWidth, state.canvasHeight)

      // Optional: very light tint to match the rpsls depth if needed, but clearRect is cleanest
      // Ground Line (Hairline Museum Aesthetic)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 0.5
      const groundY = state.groundY
      ctx.beginPath()
      ctx.moveTo(0, groundY)
      ctx.lineTo(state.canvasWidth, groundY)
      ctx.stroke()

      // Draw Obstacles (Brutalist Pillars)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 0.5

      state.obstacles.forEach((obs) => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height)
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height)
      })

      // Draw Player (Ghost Wireframe / Isometric Cube)
      const p = state.player

      // 3D rotation projection math
      const size = p.width / 2 // radius
      const cx = p.x + size
      const cy = p.y + p.height / 2
      const t = state.rotation

      // 8 corners of a cube
      const nodes = [
        [-1, -1, -1],
        [1, -1, -1],
        [1, 1, -1],
        [-1, 1, -1],
        [-1, -1, 1],
        [1, -1, 1],
        [1, 1, 1],
        [-1, 1, 1],
      ]

      const edges = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0], // back face
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 4], // front face
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7], // connecting edges
      ]

      const cosT = Math.cos(t)
      const sinT = Math.sin(t)
      const cosT2 = Math.cos(t * 0.5) // Slower secondary rotation
      const sinT2 = Math.sin(t * 0.5)

      const projectedNodes = nodes.map((node) => {
        let x = node[0]
        let y = node[1]
        let z = node[2]

        // Rotate X
        const y1 = y * cosT - z * sinT
        const z1 = y * sinT + z * cosT
        y = y1
        z = z1

        // Rotate Y
        const x1 = x * cosT2 - z * sinT2
        const z2 = x * sinT2 + z * cosT2
        x = x1
        z = z2

        // Simple orthographic projection
        return {
          x: cx + x * size,
          y: cy + y * size,
        }
      })

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1 // Crisp hairline
      ctx.beginPath()

      edges.forEach((edge) => {
        const p1 = projectedNodes[edge[0]]
        const p2 = projectedNodes[edge[1]]
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
      })

      ctx.stroke()
    }

    const checkCollision = () => {
      const p = gameState.current.player
      for (const obs of gameState.current.obstacles) {
        if (
          p.x < obs.x + obs.width &&
          p.x + p.width > obs.x &&
          p.y < obs.y + obs.height &&
          p.y + p.height > obs.y
        ) {
          return true
        }
      }
      return false
    }

    let animationFrameId: number

    let lastFrameTime = 0
    let accumulator = 0
    const stepMs = 1000 / 60
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const loop = (time: number) => {
      if (!isPlaying) return
      accumulator += lastFrameTime
        ? Math.min(time - lastFrameTime, 100)
        : stepMs
      lastFrameTime = time
      const state = gameState.current
      while (accumulator >= stepMs) {
        accumulator -= stepMs
        state.frame++
        if (!reducedMotion) state.rotation += 0.05 // Continuously rotate cube

        // Physics Update
        state.player.velocity += GRAVITY
        state.player.y += state.player.velocity

        // Ground Collision
        const floor = state.groundY - state.player.height
        if (state.player.y > floor) {
          state.player.y = floor
          state.player.velocity = 0
          state.isJumping = false
        }

        // Speed Acceleration
        if (state.speed < MAX_SPEED) {
          state.speed += ACCELERATION
        }

        // Move Obstacles
        state.obstacles.forEach((obs) => {
          obs.x -= state.speed
        })

        // Remove off-screen obstacles & increment score
        if (
          state.obstacles.length > 0 &&
          state.obstacles[0].x + state.obstacles[0].width < 0
        ) {
          state.obstacles.shift()
          state.score += 100
          setScore(Math.floor(state.score))
        }

        // Spawn Obstacles
        const timeSinceLastSpawn = state.frame - state.lastSpawnAt
        const currentSpawnTarget =
          SPAWN_MIN_RATE + Math.random() * (SPAWN_MAX_RATE - SPAWN_MIN_RATE)

        if (timeSinceLastSpawn > currentSpawnTarget) {
          const height = 30 + Math.random() * 50
          const groundY = state.groundY
          state.obstacles.push({
            x: state.canvasWidth,
            y: groundY - height,
            width: OBSTACLE_WIDTH,
            height: height,
            velocity: 0,
          })
          state.lastSpawnAt = state.frame
        }

        // Collision Detection
        if (checkCollision()) {
          setGameOver(true)
          setIsPlaying(false)
          setHighScore((prev) => Math.max(prev, Math.floor(state.score)))
          setCurrentQuote(
            DEATH_QUOTES[Math.floor(Math.random() * DEATH_QUOTES.length)]
          )
          draw() // Draw final frame
          return
        }
      }
      draw()
      animationFrameId = requestAnimationFrame(loop)
      animationRef.current = animationFrameId
    }

    const resize = new ResizeObserver(updateSize)
    if (canvas.parentElement) resize.observe(canvas.parentElement)
    updateSize()

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(loop)
      animationRef.current = animationFrameId
    } else {
      draw()
    }

    return () => {
      resize.disconnect()
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [isPlaying, gameOver])

  return (
    <div
      className="escape-game bg-background/90 w-full cursor-pointer"
      role="application"
      aria-label="Escape runner. Press Space or tap to start and jump."
      tabIndex={0}
      onPointerDown={handleJump}
    >
      <h1 className="sr-only">Escape runner</h1>
      {/* Subtle depth behind the playfield. */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-[100vw] w-[100vw] -translate-x-1/2 -translate-y-1/2 opacity-[0.05] md:h-[70vw] md:w-[70vw]"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
          }}
        />
      </div>

      <canvas ref={canvasRef} className="relative z-10 block h-full w-full" />

      {/* Return to the playground without triggering a jump. */}
      {!gameOver && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            router.push('/playground')
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="escape-back button absolute top-6 left-6 z-50 bg-[#151515] font-mono md:top-8 md:left-12"
          aria-label="Return to playground"
        >
          <span className="text-accent">←</span> <span>Playground</span>
        </button>
      )}

      {/* UI Overlay */}
      <div className="text-muted pointer-events-none absolute top-6 right-6 flex flex-col items-end gap-1 font-mono text-sm tracking-widest select-none md:top-8 md:right-12">
        <span>HI {highScore.toString().padStart(5, '0')}</span>
        <span className="text-accent">{score.toString().padStart(5, '0')}</span>
      </div>

      {/* Start Screen */}
      {!isPlaying && !gameOver && (
        <div className="escape-start pointer-events-none absolute inset-0 flex flex-col items-center justify-center mix-blend-difference">
          <h2 className="font-mono text-4xl tracking-[0.2em] text-white uppercase md:text-6xl">
            ESCAPE
          </h2>
          <span className="text-muted mt-6 font-mono text-xs tracking-widest uppercase">
            {isTouchDevice
              ? 'TAP TO START · TAP TO JUMP'
              : 'CLICK OR PRESS SPACE TO START'}
          </span>
        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <div
          className="escape-result bg-background pointer-events-auto absolute inset-0 z-40 flex flex-col items-center justify-center backdrop-blur-md"
          role="status"
          aria-live="polite"
        >
          <span className="font-mono text-3xl tracking-[0.1em] text-white uppercase md:text-6xl">
            SIGNAL LOST
          </span>

          <span className="mt-8 mb-4 max-w-[85vw] text-center font-sans text-sm font-medium text-white/90 md:max-w-md md:text-base">
            &ldquo;{currentQuote}&rdquo;
          </span>

          <span className="text-accent mt-2 mb-10 font-mono text-xs tracking-[0.3em] uppercase">
            Final Score: {score}
          </span>

          <div className="flex flex-col items-center gap-4 md:flex-row">
            <button
              onClick={(e) => {
                e.stopPropagation()
                resetGame()
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="button button-primary font-mono"
            >
              Play again
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                router.push('/playground')
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="button font-mono"
            >
              Back to playground
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
