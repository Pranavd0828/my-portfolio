import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { caseStudies } from '../src/content/caseStudies.ts'

const require = createRequire(import.meta.url)
const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:3020'
assert.match(base, /^http:\/\/(127\.0\.0\.1|localhost):\d+$/)
const output = process.env.PORTFOLIO_BROWSER_OUTPUT || join(tmpdir(), 'portfolio-review')
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.PORTFOLIO_CHROMIUM_EXECUTABLE })
const context = await browser.newContext({ reducedMotion: 'reduce' })
const page = await context.newPage()
const routes = ['/', '/work', '/reading', '/playground', '/escape', '/rpsls', ...caseStudies.map(s => `/work/${s.slug}`)]
const findings = []
const errors = []
page.on('pageerror', error => errors.push(error.message))
try {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 })
    for (const route of routes) {
      await page.goto(base + route, { waitUntil: 'networkidle' })
      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') })
      const result = await page.evaluate(async () => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] } }))
      findings.push({ route, width, violations: result.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) })
      if (route === '/') {
        for (const img of await page.locator('#prototypes img, figure img').all()) {
          await img.scrollIntoViewIfNeeded()
          await img.evaluate(el => el.decode())
          assert.equal(await img.evaluate(el => getComputedStyle(el).filter), 'none', 'Artwork retains color')
        }
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
        await page.screenshot({ path: `${output}/opening-${width}.png`, scale: 'css' })
        await page.screenshot({ path: `${output}/home-${width}.png`, fullPage: true, scale: 'css' })
      }
    }
  }
  await page.goto(base + '/reading')
  await page.locator('.book-row details').first().locator('summary').click()
  assert.equal(await page.locator('.book-cover').first().evaluate(el => getComputedStyle(el).filter), 'none')
  const violations = findings.filter(f => f.violations.length)
  await writeFile(`${output}/accessibility.json`, JSON.stringify({ findings, errors }, null, 2))
  console.log(JSON.stringify({ pages: findings.length, violations, errors }, null, 2))
  assert.equal(violations.length, 0, 'Accessibility findings need review')
  assert.equal(errors.length, 0, 'No uncaught browser exceptions')
} finally {
  await browser.close()
}
