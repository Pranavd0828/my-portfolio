import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { caseStudies } from '../src/content/caseStudies.ts'

const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:3020'
assert.match(base, /^http:\/\/(127\.0\.0\.1|localhost):\d+$/)
const output = process.env.PORTFOLIO_BROWSER_OUTPUT || '/tmp/portfolio-design'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({
  executablePath: process.env.PORTFOLIO_CHROMIUM_EXECUTABLE,
})
const routes = ['/', '/work', '/reading', '/playground', '/escape', '/rpsls',
  ...caseStudies.map((story) => `/work/${story.slug}`)]
const typography = []
const controls = []
const specimens = []
const errors = []
// Component specimens exclude sticky page chrome; navigation is captured separately.
const specimenStyle = '.site-header, .story-toc, .skip-link { visibility: hidden !important; }'
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' })
  page.on('pageerror', (error) => errors.push(error.message))
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 })
    for (const route of routes) {
      await page.goto(base + route)
      await page.evaluate(() => document.fonts.ready)
      if (route === '/') await page.screenshot({ path: `${output}/opening-${width}.png`, scale: 'css' })
      for (const summary of await page.locator('details:not(.story-toc-mobile) > summary').all()) {
        if (await summary.isVisible() &&
          !(await summary.evaluate((element) => element.parentElement.open))) await summary.click()
      }
      const text = await page.locator('h1,h2,h3,h4,p,li,label,input,textarea,select,button,summary,dt,dd,figcaption').evaluateAll((elements) =>
        elements.filter((element) => element.getClientRects().length &&
          !element.closest('[aria-hidden="true"],.sr-only')).map((element) => {
          const style = getComputedStyle(element)
          return {
            tag: element.tagName.toLowerCase(),
            sample: (element.textContent || element.getAttribute('aria-label') || '').trim().slice(0, 90),
            font: style.fontFamily,
            gameDisplay: element.classList.contains('font-mono'),
            size: parseFloat(style.fontSize),
            line: parseFloat(style.lineHeight),
            ratio: parseFloat(style.lineHeight) / parseFloat(style.fontSize),
          }
        }))
      const problems = text.filter((item) =>
        (!item.font.toLowerCase().includes('inter') && !(route === '/escape' && item.gameDisplay)) ||
        item.size < 12 || (item.tag !== 'select' && (!Number.isFinite(item.ratio) ||
        item.ratio < (item.tag === 'h1' ? 1.04 : 1.19))))
      typography.push({ route, width, textNodes: text.length, problems,
        scales: [...new Set(text.map((item) => `${item.size}/${item.line}`))] })
    }
    await page.goto(base + '/')
    for (const [name, selector] of [
      ['introduction', '#about'], ['professional-work', '#production'],
      ['experience', '#journey'], ['contact', '#connect'],
    ]) {
      const element = page.locator(selector)
      await element.screenshot({ path: `${output}/${name}-${width}.png`, scale: 'css', style: specimenStyle })
      specimens.push({ name, width, file: `${name}-${width}.png` })
    }
    if (width === 390) {
      await page.getByRole('button', { name: 'Menu', exact: false }).click()
      await page.screenshot({ path: `${output}/navigation-${width}.png`, scale: 'css' })
      await page.getByRole('button', { name: 'Close', exact: false }).press('Escape')
    }
    await page.goto(base + '/work/rakuten-programmatic-loyalty')
    for (const [name, selector] of [
      ['decision-model', '#explore-model'], ['system-diagram', '#system'],
      ['disclosure', '.technical-details'],
    ]) {
      const element = page.locator(selector)
      if (await element.count()) {
        if (name === 'disclosure') await element.locator('summary').click()
        await element.screenshot({ path: `${output}/${name}-${width}.png`, scale: 'css', style: specimenStyle })
        specimens.push({ name, width, file: `${name}-${width}.png` })
      }
    }
    await page.goto(base + '/work/whatsapp-regional-voice')
    await page.locator('video').locator('..').locator('..').screenshot({
      path: `${output}/media-${width}.png`, scale: 'css', style: specimenStyle,
    })
    specimens.push({ name: 'media', width, file: `media-${width}.png` })
  }
  for (const [name, route, selector] of [
    ['primary', '/', '.button-primary'],
    ['secondary', '/work/whatsapp-catch-up', 'a.button:not(.button-primary)'],
  ]) {
    await page.goto(base + route)
    const locator = page.locator(selector).first()
    await locator.scrollIntoViewIfNeeded()
    const styles = () => locator.evaluate((element) => {
      const s = getComputedStyle(element)
      return { color: s.color, background: s.backgroundColor, border: s.borderColor,
        outline: s.outlineStyle, outlineWidth: s.outlineWidth, line: s.lineHeight,
        height: element.getBoundingClientRect().height }
    })
    await page.mouse.move(0, 0)
    const normal = await styles()
    await locator.hover()
    await page.waitForTimeout(250)
    const hover = await styles()
    await page.mouse.down()
    await page.waitForTimeout(250)
    const active = await styles()
    await page.screenshot({ path: `${output}/${name}-pressed.png`, scale: 'css' })
    await page.mouse.move(0, 0)
    await page.mouse.up()
    await locator.focus()
    await page.keyboard.press('Tab')
    await page.keyboard.press('Shift+Tab')
    const focus = await styles()
    controls.push({ name, normal, hover, active, focus })
    assert.notEqual(normal.background, active.background, `${name}: visible pressed feedback`)
    assert.equal(focus.outline, 'solid', `${name}: keyboard focus outline`)
    assert.ok(normal.height >= 44)
  }
  assert.deepEqual(errors, [])
  const problems = typography.filter((entry) => entry.problems.length)
  await writeFile(`${output}/design.json`, JSON.stringify({ typography, controls, specimens, errors }, null, 2))
  console.log(JSON.stringify({ routeWidths: typography.length,
    textNodes: typography.reduce((sum, entry) => sum + entry.textNodes, 0),
    problems: problems.map(({route, width, problems}) => ({route, width, problems})), controls }, null, 2))
  assert.equal(problems.length, 0, 'Rendered typography needs review; inspect design.json')
} finally {
  await browser.close()
}
