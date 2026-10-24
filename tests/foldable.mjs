import assert from 'node:assert/strict'
import { chromium, webkit } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { caseStudies } from '../src/content/caseStudies.ts'
const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:3040'
assert.match(base, /^http:\/\/(127\.0\.0\.1|localhost):\d+$/)
const output = process.env.PORTFOLIO_BROWSER_OUTPUT || '/tmp/portfolio-foldable'
await mkdir(output, { recursive: true })
// Representative browser areas, not certified device viewport measurements.
const sizes = [[360,800],[466,678],[678,466],[626,890],[890,626],[720,720],[344,626],[320,600]]
const routes = ['/', '/work', '/reading', '/playground', '/escape', '/rpsls', ...caseStudies.map(s => '/work/' + s.slug)]
const results = []
for (const engine of ['chromium', 'webkit']) {
  const browser = await { chromium, webkit }[engine].launch({ executablePath: process.env[`PORTFOLIO_${engine.toUpperCase()}_EXECUTABLE`] })
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce', hasTouch: true })
    for (const route of routes) {
      await page.goto(base + route)
      await page.evaluate(() => document.fonts.ready)
      for (const [width, height] of sizes) {
        await page.setViewportSize({ width, height })
        const bad = await page.evaluate(() => {
          const issues = []
          if (document.documentElement.scrollWidth > innerWidth + 1) issues.push('document overflow')
          for (const el of document.querySelectorAll('main h1,main h2,main p,main button,main input,main textarea,.site-header a,.site-header button')) {
            const r = el.getBoundingClientRect()
            if (!r.width || !el.getClientRects().length || getComputedStyle(el).visibility === 'hidden' || el.closest('.sr-only,[aria-hidden="true"]')) continue
            if (r.left < -2 || r.right > innerWidth + 2) issues.push(el.textContent.slice(0,60))
          }
          return issues
        })
        assert.deepEqual(bad, [], `${engine} ${route} ${width}x${height}`)
        results.push({engine,route,width,height,passed:true})
      }
    }
    await page.goto(base)
    await page.setViewportSize({ width: 360, height: 800 })
    await page.getByRole('button', { name: 'Menu', exact: true }).click()
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.setViewportSize({ width: 360, height: 800 })
    await page.getByRole('button', { name: 'Menu', exact: true }).click()
    await page.getByRole('button', { name: 'Close', exact: true }).click()
    assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden')
    await page.close()
    const intro = await browser.newPage({ viewport: { width: 360, height: 800 } })
    await intro.goto(base)
    await intro.getByRole('dialog').waitFor()
    await intro.setViewportSize({ width: 890, height: 626 })
    await intro.setViewportSize({ width: 360, height: 800 })
    await intro.getByRole('button', { name: 'Skip intro' }).click()
    assert.equal(await intro.getByRole('dialog').count(), 0)
    assert.notEqual(await intro.evaluate(() => document.body.style.overflow), 'hidden')
    console.log(`PASS ${engine}: 128 route/viewport checks, menu resizing, and takeover resizing`)
  } finally { await browser.close() }
}
await writeFile(output + '/foldable.json', JSON.stringify(results, null, 2))
