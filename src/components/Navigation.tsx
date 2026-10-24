'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function Navigation() {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const header = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const element = header.current
    if (!element) return
    const measure = () =>
      document.documentElement.style.setProperty(
        '--header-height',
        `${element.getBoundingClientRect().height}px`
      )
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    measure()
    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty('--header-height')
    }
  }, [])
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const close = () => setOpen(false)
    desktop.addEventListener('change', close)
    window.addEventListener('popstate', close)
    return () => { desktop.removeEventListener('change', close); window.removeEventListener('popstate', close) }
  }, [])
  useEffect(() => {
    if (!open) return
    function dismiss(event: PointerEvent) {
      if (!header.current?.contains(event.target as Node)) setOpen(false)
    }
    function keyboard(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', keyboard)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', keyboard)
    }
  }, [open])
  return (
    <header
      className="site-header"
      ref={header}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <div className="shell header-inner">
        <Link
          prefetch={false}
          href="/"
          className="wordmark"
          aria-label="Pranav Deo home"
          onClick={() => setOpen(false)}
        >
          {/* The selected vector monogram also appears in the browser tab. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon.svg" alt="" width="32" height="32" />
          Home
        </Link>
        <div className="mobile-header-actions">
          <a
            href="/Pranav-Deo-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Résumé<span className="sr-only"> (PDF, opens in a new tab)</span>
          </a>
          <button
            ref={toggle}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? 'Close' : 'Menu'}
            <span aria-hidden="true">{open ? '−' : '+'}</span>
          </button>
        </div>
        <nav
          id="main-navigation"
          aria-label="Main navigation"
          className="nav-links"
          data-open={open}
          onClick={() => setOpen(false)}
        >
          <Link prefetch={false} href="/#about">
            About
          </Link>
          <Link
            prefetch={false}
            href="/work"
            aria-current={path.startsWith('/work') ? 'page' : undefined}
          >
            Work
          </Link>
          <Link prefetch={false} href="/#prototypes">
            Prototypes
          </Link>
          <Link prefetch={false} href="/#journey">
            Experience
          </Link>
          <a
            className="desktop-resume"
            href="/Pranav-Deo-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Résumé<span className="sr-only"> (PDF, opens in a new tab)</span>
          </a>
          <Link prefetch={false} href="/#connect">
            Contact
          </Link>
          <Link prefetch={false} className="mobile-menu-extra" href="/reading">
            Reading
          </Link>
          <Link
            prefetch={false}
            className="mobile-menu-extra"
            href="/playground"
          >
            Playground
          </Link>
        </nav>
      </div>
    </header>
  )
}
