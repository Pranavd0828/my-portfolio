'use client'
import { useEffect, useRef } from 'react'
type Item = { id: string; label: string }
export default function StoryNavigation({ items }: { items: Item[] }) {
  const summary = useRef<HTMLElement>(null)
  useEffect(() => {
    const element = summary.current
    if (!element) return
    const measure = () =>
      document.documentElement.style.setProperty(
        '--story-nav-height',
        `${element.getBoundingClientRect().height + 2}px`
      )
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    measure()
    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty('--story-nav-height')
    }
  }, [])
  const links = items.map((item) => (
    <a key={item.id} href={`#${item.id}`}>
      {item.label}
    </a>
  ))
  return (
    <div className="story-toc">
      <nav className="story-toc-desktop" aria-label="On this page">
        <p className="eyebrow">In this story</p>
        {links}
      </nav>
      <details
        className="story-toc-mobile"
        onClick={(event) => {
          if ((event.target as HTMLElement).closest('a'))
            event.currentTarget.open = false
        }}
      >
        <summary
          ref={summary}
          onClick={(event) => {
            event.preventDefault()
            const details = event.currentTarget
              .parentElement as HTMLDetailsElement
            details.open = !details.open
            if (details.open) {
              event.currentTarget.scrollIntoView({
                block: 'start',
                behavior: 'instant',
              })
            }
          }}
        >
          In this story
        </summary>
        <nav aria-label="On this page">{links}</nav>
      </details>
    </div>
  )
}
