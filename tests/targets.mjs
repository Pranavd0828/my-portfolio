import assert from 'node:assert/strict'
import { chromium, webkit } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { caseStudies } from '../src/content/caseStudies.ts'

const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:3020'
assert.match(base, /^http:\/\/(127\.0\.0\.1|localhost):\d+$/)
const output = process.env.PORTFOLIO_BROWSER_OUTPUT || '/tmp/portfolio-targets'
await mkdir(output, { recursive: true })
const routes = [
  '/',
  '/work',
  '/reading',
  '/playground',
  '/escape',
  '/rpsls',
  ...caseStudies.map((story) => '/work/' + story.slug),
]
const results = []
const failures = []
for (const engine of ['chromium', 'webkit']) {
  const browser = await { chromium, webkit }[engine].launch({
    executablePath: process.env[`PORTFOLIO_${engine.toUpperCase()}_EXECUTABLE`],
  })
  try {
    const page = await browser.newPage({
      reducedMotion: 'reduce',
      hasTouch: true,
    })
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      for (const route of routes) {
        await page.goto(base + route)
        const selector =
          'button:not(:disabled),a:not(.skip-link),summary,input:not([type="hidden"]):not(:disabled),textarea:not(:disabled),select'
        let count = 0
        async function inspect(locator, context) {
          if (!(await locator.isVisible())) return
          await locator.evaluate((element) =>
            element.scrollIntoView({
              block: 'center',
              inline: 'nearest',
              behavior: 'instant',
            })
          )
          await page.evaluate(
            () =>
              new Promise((resolve) =>
                requestAnimationFrame(() => requestAnimationFrame(resolve))
              )
          )
          const target = await locator.evaluate((element) => {
            const r = element.getBoundingClientRect()
            if (!r.width || !r.height) return null
            // Cardinal edge points stay inside rounded rectangles and circular icons.
            // Inline links can wrap, so test their actual fragments, not empty space
            // inside the union of those fragments.
            const points = [...element.getClientRects()]
              .filter((box) => box.width > 8 && box.height > 8)
              .flatMap((box) => {
                const cx = box.left + box.width / 2,
                  cy = box.top + box.height / 2
                return [
                  [cx, cy],
                  [box.left + 4, cy],
                  [box.right - 4, cy],
                  [cx, box.top + 4],
                  [cx, box.bottom - 4],
                ]
              })
            return {
              name:
                element.getAttribute('aria-label') ||
                element.textContent.trim().slice(0, 70),
              width: r.width,
              height: r.height,
              minimum44:
                !!element.closest('.site-header,nav') ||
                !!element.closest('[class*="ProductVideo_controls"]'),
              hits: points.map(([x, y]) => ({
                x,
                y,
                hit: element.contains(document.elementFromPoint(x, y)),
              })),
            }
          })
          if (!target) return
          count++
          if (
            target.hits.some((point) => !point.hit) ||
            (target.minimum44 && (target.width < 43.9 || target.height < 43.9))
          ) {
            failures.push({
              engine,
              viewportWidth: width,
              route,
              context,
              ...target,
            })
          }
        }
        for (const locator of await page.locator(selector).all())
          await inspect(locator, 'default')
        if (width < 1024) {
          await page.getByRole('button', { name: 'Menu', exact: false }).click()
          for (const locator of await page.locator('#main-navigation a').all())
            await inspect(locator, 'expanded main menu')
          await page
            .getByRole('button', { name: 'Close', exact: false })
            .press('Escape')
        }
        results.push({ engine, width, route, controls: count })
        if (route === '/' && engine === 'chromium') {
          await page.locator('.footer').scrollIntoViewIfNeeded()
          await page.screenshot({
            path: `${output}/footer-${width}.png`,
            scale: 'css',
          })
        }
      }
    }
  } finally {
    await browser.close()
  }
}
await writeFile(
  output + '/targets.json',
  JSON.stringify({ results, failures }, null, 2)
)
console.log(
  JSON.stringify(
    {
      routeWidths: results.length,
      controls: results.reduce((sum, item) => sum + item.controls, 0),
      failureCount: failures.length,
      firstFailures: failures.slice(0, 5),
    },
    null,
    2
  )
)
assert.equal(
  failures.length,
  0,
  'Inspect targets.json for obscured or undersized controls'
)
