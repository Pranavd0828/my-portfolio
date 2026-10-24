'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './ProductVideo.module.css'

type ProductVideoProps = {
  src: string
  title: string
  soundToggle?: boolean
  poster?: string
  seekable?: boolean
}

export default function ProductVideo({
  src,
  title,
  soundToggle = false,
  poster,
  seekable = false,
}: ProductVideoProps) {
  const video = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [failed, setFailed] = useState(false)
  const [duration, setDuration] = useState(0)
  const [position, setPosition] = useState(0)

  const [playing, setPlaying] = useState(false)
  const manuallyPaused = useRef(false)
  const explicitlyPlaying = useRef(false)

  useEffect(() => {
    const element = video.current
    if (!element) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection
    let visible = false
    const update = () => {
      if (!visible || document.hidden) {
        explicitlyPlaying.current = false
        element.pause()
        return
      }
      if (
        !manuallyPaused.current &&
        (explicitlyPlaying.current ||
          (!motion.matches && !connection?.saveData))
      ) {
        void element.play().catch(() => setPlaying(false))
      } else {
        element.pause()
      }
    }
    const preferenceChanged = () => {
      explicitlyPlaying.current = false
      update()
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        update()
      },
      { threshold: 0.1 }
    )
    observer.observe(element)
    motion.addEventListener('change', preferenceChanged)
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      motion.removeEventListener('change', preferenceChanged)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  function togglePlayback() {
    const element = video.current
    if (!element) return
    if (failed) {
      setFailed(false)
      element.load()
    }
    manuallyPaused.current = !element.paused
    // Explicit play is allowed under reduced motion until the video leaves view.
    // A delayed visibility callback must not cancel the action just requested.
    explicitlyPlaying.current = element.paused
    if (element.paused) void element.play().catch(() => setPlaying(false))
    else element.pause()
  }

  function toggleSound() {
    const element = video.current
    if (!element) return
    element.muted = !element.muted
    setMuted(element.muted)
  }

  function timeLabel(seconds: number) {
    const value = Math.max(0, Math.floor(seconds))
    return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`
  }

  return (
    <div className={styles.frame}>
      <div className={styles.viewport}>
        <video
          ref={video}
          src={src}
          poster={poster}
          title={title}
          aria-label={title}
          loop
          muted={muted}
          onPlay={() => {
            setPlaying(true)
            setFailed(false)
          }}
          onError={() => {
            setFailed(true)
            setPlaying(false)
          }}
          onPause={() => setPlaying(false)}
          onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
          onLoadedMetadata={(event) => {
            const value = event.currentTarget.duration
            if (seekable) setDuration(Number.isFinite(value) ? value : 0)
          }}
          onTimeUpdate={(event) => {
            if (seekable) setPosition(event.currentTarget.currentTime)
          }}
          playsInline
          preload="none"
        />
        {failed && (
          <p className={styles.failure} role="status">
            Preview unavailable. Use play to retry, or read the product story
            below.
          </p>
        )}
        <noscript>
          <a className={styles.fallback} href={src}>
            Open the video preview
          </a>
        </noscript>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.control}
            onClick={togglePlayback}
            aria-label={playing ? 'Pause preview' : 'Play preview'}
            title={playing ? 'Pause preview' : 'Play preview'}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d={playing ? 'M8 5v14M16 5v14' : 'm8 5 11 7-11 7V5Z'} />
            </svg>
          </button>
          {soundToggle && (
            <button
              type="button"
              className={styles.control}
              onClick={toggleSound}
              aria-label={muted ? 'Unmute preview' : 'Mute preview'}
              aria-pressed={!muted}
              title={muted ? 'Unmute preview' : 'Mute preview'}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                {muted ? (
                  <>
                    <path d="M5 9v6h4l5 4V5L9 9H5Z" />
                    <path d="m18 9 4 6m0-6-4 6" />
                  </>
                ) : (
                  <>
                    <path d="M4 9v6h4l5 4V5L8 9H4Z" />
                    <path d="M17 9.5a4 4 0 0 1 0 5M19.5 7a8 8 0 0 1 0 10" />
                  </>
                )}
              </svg>
            </button>
          )}
        </div>
      </div>
      {seekable && (
        <div className={styles.timeline}>
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={Math.min(position, duration)}
            disabled={!duration || failed}
            aria-label="Seek preview"
            aria-valuetext={`${timeLabel(position)} of ${timeLabel(duration)}`}
            onChange={(event) => {
              const element = video.current
              if (!element || !duration) return
              const next = Math.min(
                duration,
                Math.max(0, Number(event.target.value))
              )
              element.currentTime = next
              setPosition(next)
            }}
          />
          <span aria-hidden="true">
            {timeLabel(position)} / {timeLabel(duration)}
          </span>
        </div>
      )}
    </div>
  )
}
