import assert from 'node:assert/strict'
import { chromium, webkit } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { caseStudies } from '../src/content/caseStudies.ts'
const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:3020'
assert.match(base, /^http:\/\/(127\.0\.0\.1|localhost):\d+$/)
const output = process.env.PORTFOLIO_BROWSER_OUTPUT || '/tmp/portfolio-keyboard'
await mkdir(output, { recursive: true })
const results = []
const routes = [
  '/',
  '/work',
  '/reading',
  '/playground',
  '/escape',
  '/rpsls',
  ...caseStudies.map((s) => '/work/' + s.slug),
]
for (const engine of ['chromium', 'webkit']) {
  const browser = await { chromium, webkit }[engine].launch({
    executablePath: process.env[`PORTFOLIO_${engine.toUpperCase()}_EXECUTABLE`],
  })
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' })
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 844 })
      for (const route of routes) {
        await page.goto(base + route)
        const visited = new Set()
        for (let step = 0; step < 160; step++) {
          // macOS WebKit uses Option+Tab to include links in keyboard traversal.
          await page.keyboard.press(
            engine === 'webkit' && process.platform === 'darwin'
              ? 'Alt+Tab'
              : 'Tab'
          )
          // WebKit can finish native focus scrolling after the first rendered frame.
          await page.waitForFunction(
            () => {
              const el = document.activeElement
              if (!el || el === document.body) return true
              return [...el.getClientRects()].some((r) => {
                const top = Math.max(0, r.top),
                  bottom = Math.min(innerHeight, r.bottom)
                return (
                  bottom > top &&
                  el.contains(
                    document.elementFromPoint(
                      r.left + r.width / 2,
                      (top + bottom) / 2
                    )
                  )
                )
              })
            },
            null,
            { timeout: 3000 }
          )
          const state = await page.evaluate(
            () =>
              new Promise((resolve) =>
                requestAnimationFrame(() => {
                  const el = document.activeElement
                  if (!el || el === document.body) return resolve(null)
                  const r = el.getBoundingClientRect()
                  const style = getComputedStyle(el)
                  const rects = [...el.getClientRects()]
                  resolve({
                    index: [...document.querySelectorAll('*')].indexOf(el),
                    name:
                      el.getAttribute('aria-label') ||
                      el.textContent.trim().slice(0, 70),
                    visible:
                      r.width > 0 &&
                      r.height > 0 &&
                      rects.some((fragment) => {
                        const top = Math.max(0, fragment.top),
                          bottom = Math.min(innerHeight, fragment.bottom)
                        return (
                          bottom > top &&
                          el.contains(
                            document.elementFromPoint(
                              fragment.left + fragment.width / 2,
                              (top + bottom) / 2
                            )
                          )
                        )
                      }),
                    outline:
                      style.outlineStyle !== 'none' &&
                      parseFloat(style.outlineWidth) > 0,
                  })
                })
              )
          )
          if (!state || visited.has(state.index)) break
          if (!state.visible)
            await page.screenshot({ path: output + '/obscured-focus.png' })
          assert.ok(
            state.visible,
            `${engine} ${width} ${route}: obscured focus ${JSON.stringify(state)}`
          )
          assert.ok(
            state.outline,
            `${engine} ${width} ${route}: missing focus indicator ${JSON.stringify(state)}`
          )
          visited.add(state.index)
        }
        assert.ok(
          visited.size > 4,
          `${route}: keyboard traversal did not reach the page`
        )
        results.push({ engine, route, width, focusedControls: visited.size })
      }
      console.log(
        `PASS ${engine} ${width}: every route keyboard focus visibility`
      )
    }
  } finally {
    await browser.close()
    await writeFile(output + '/keyboard.json', JSON.stringify(results, null, 2))
  }
}
