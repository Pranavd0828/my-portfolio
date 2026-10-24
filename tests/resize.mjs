import assert from 'node:assert/strict'
import { chromium, webkit } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { caseStudies } from '../src/content/caseStudies.ts'

const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:3020'
assert.match(base, /^http:\/\/(127\.0\.0\.1|localhost):\d+$/)
const output = process.env.PORTFOLIO_BROWSER_OUTPUT || '/tmp/portfolio-resize'
await mkdir(output, { recursive: true })
const routes = [
  '/',
  '/work',
  '/reading',
  '/playground',
  '/escape',
  '/rpsls',
  ...caseStudies.map((s) => '/work/' + s.slug),
]
const frames = []
const widths = Array.from({ length: 71 }, (_, i) => 320 + i * 16)
const sweep = [...widths, ...widths.toReversed()]
for (const engine of ['chromium', 'webkit']) {
  const browser = await { chromium, webkit }[engine].launch({
    executablePath: process.env[`PORTFOLIO_${engine.toUpperCase()}_EXECUTABLE`],
  })
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' })
    for (const route of routes) {
      await page.goto(base + route)
      await page.evaluate(() => document.fonts.ready)
      for (const width of sweep) {
        await page.setViewportSize({ width, height: 844 })
        const problem = await page.evaluate(
          () =>
            new Promise((resolve) =>
              requestAnimationFrame(() => {
                const elements = [
                  ...document.querySelectorAll(
                    'main h1, main h2, main p, main button, main input, main select, .site-header a, .site-header button'
                  ),
                ]
                resolve({
                  overflow:
                    document.documentElement.scrollWidth > innerWidth + 1,
                  clipped: elements
                    .filter((el) => {
                      const r = el.getBoundingClientRect()
                      return (
                        el.getClientRects().length &&
                        r.width &&
                        !el.closest('.sr-only,[aria-hidden="true"]') &&
                        (r.left < -2 || r.right > innerWidth + 2)
                      )
                    })
                    .map((el) => el.textContent.slice(0, 60)),
                })
              })
            )
        )
        assert.deepEqual(
          problem,
          { overflow: false, clipped: [] },
          `${engine} ${route} ${width}`
        )
        frames.push({ engine, route, width, passed: true })
      }
      console.log(`PASS ${engine} ${route}: expanding and contracting resize`)
    }
  } finally {
    await browser.close()
    await writeFile(output + '/resize.json', JSON.stringify(frames, null, 2))
  }
}
console.log(`PASS ${frames.length} rendered resize frames`)
