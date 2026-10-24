'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import styles from './BrandIntro.module.css'

const merchants = [
  ['macys', "Macy's"], ['apple', 'Apple'], ['sephora', 'Sephora'], ['nike', 'Nike'],
  ['coach', 'Coach'], ['adidas', 'adidas'], ['lululemon', 'lululemon'], ['samsung', 'Samsung'],
  ['newbalance', 'New Balance'], ['target', 'Target'], ['puma', 'PUMA'], ['ulta', 'Ulta Beauty'],
  ['rei', 'REI'], ['lenovo', 'Lenovo'], ['hoka', 'HOKA'], ['lego', 'LEGO'],
  ['nordstrom-rack', 'Nordstrom Rack'], ['bloomingdales', "Bloomingdale's"], ['gap', 'Gap'],
  ['expedia', 'Expedia'], ['under-armour', 'Under Armour'], ['old-navy', 'Old Navy'],
  ['ikea', 'IKEA'], ['best-buy', 'Best Buy'],
  ['converse', 'Converse'], ['crocs', 'Crocs'], ['asics', 'ASICS'], ['ugg', 'UGG'],
]
const seenKey = 'pranav-portfolio-intro-v2'
const duration = 3600

export default function BrandIntro() {
  const dialog = useRef<HTMLDialogElement>(null)
  const dismiss = useRef<() => void>(() => {})
  const path = usePathname()
  const initialPath = useRef(path)

  useEffect(() => {
    const element = dialog.current
    if (!element || typeof element.showModal !== 'function') return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    let seen = false
    try { seen = localStorage.getItem(seenKey) === 'seen' } catch { /* Storage is optional. */ }
    if (motion.matches || location.hash || navigation?.type === 'back_forward' || (seen && navigation?.type !== 'reload')) return

    const previousOverflow = document.body.style.overflow
    let exitTimer: ReturnType<typeof setTimeout>
    let finished = false
    const remember = () => {
      try { localStorage.setItem(seenKey, 'seen') } catch { /* The current document still dismisses normally. */ }
    }
    const finish = (focusContent = true) => {
      if (finished) return
      finished = true
      clearTimeout(timer)
      clearTimeout(exitTimer)
      element.close()
      delete element.dataset.leaving
      document.body.style.overflow = previousOverflow
      remember()
      if (focusContent) document.getElementById('main-content')?.focus({ preventScroll: true })
    }
    dismiss.current = () => finish()
    const hide = () => { if (document.hidden) finish(false) }
    const historyReturn = (event: PageTransitionEvent) => { if (event.persisted) finish(false) }
    const reducedMotion = () => { if (motion.matches) finish() }
    try {
      element.showModal()
    } catch {
      return
    }
    document.body.style.overflow = 'hidden'
    element.querySelector('button')?.focus({ preventScroll: true })
    const timer = setTimeout(() => {
      element.dataset.leaving = 'true'
      exitTimer = setTimeout(() => finish(), 300)
    }, duration)
    document.addEventListener('visibilitychange', hide)
    window.addEventListener('pageshow', historyReturn)
    motion.addEventListener('change', reducedMotion)
    return () => {
      finish(false)
      document.removeEventListener('visibilitychange', hide)
      window.removeEventListener('pageshow', historyReturn)
      motion.removeEventListener('change', reducedMotion)
    }
  }, [])

  useEffect(() => {
    if (path !== initialPath.current) dismiss.current()
  }, [path])

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="brand-intro-title"
      aria-describedby="brand-intro-description"
      onCancel={(event) => { event.preventDefault(); dismiss.current() }}
    >
      <div className={styles.topline}>
        <div className={styles.identity}>
          <span className={styles.seal} aria-hidden="true">PD</span>
          <div><strong>Pranav Deo</strong><span>Staff Product Manager at Rakuten</span></div>
        </div>
        <button type="button" className={styles.skip} onClick={() => dismiss.current()}>Skip intro <span aria-hidden="true">↗</span></button>
      </div>
      <div className={styles.scene}>
        <div className={styles.brandStage} aria-hidden="true">
        <div className={styles.brandField}>
          {merchants.map(([slug, name], index) => (
            <div className={styles.brand} key={slug} style={{ '--arrival': `${index % 6 * 65}ms` } as CSSProperties}>
              {/* Logos identify example Rakuten merchants, not personal clients. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/brands/${slug}.png`} alt="" width="100" height="100" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.hidden = true }} />
              <span className={styles.brandName}>{name}</span>
            </div>
          ))}
        </div>
        </div>
        <div className={styles.story}>
          <p className={styles.eyebrow}>The world behind the work</p>
          <h2 id="brand-intro-title">Brands seek growth.<br /><span>People seek relevance.</span></h2>
          <p id="brand-intro-description" className={styles.description}>I connect them through<br className={styles.phoneBreak} /> the products I build.</p>
          <div className={styles.decisions} aria-hidden="true"><span>Advertiser intent</span><i /><span>Product judgment</span><i /><span>Customer value</span></div>
        </div>
      </div>
      <div className={styles.bottomline}>
        <button type="button" className={styles.enter} onClick={() => dismiss.current()}>Explore my work <span aria-hidden="true">↗</span></button>
      </div>
      <div className={styles.progress} aria-hidden="true"><span /></div>
    </dialog>
  )
}
