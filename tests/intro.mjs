import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium, webkit } from 'playwright'
import axe from 'axe-core'

const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:3020'
assert.match(base, /^http:\/\/(127\.0\.0\.1|localhost):\d+$/)
const output = process.env.PORTFOLIO_BROWSER_OUTPUT || '/tmp/portfolio-intro'
await mkdir(output, { recursive: true })
const results = []
for (const engine of ['chromium', 'webkit']) {
  const browser = await { chromium, webkit }[engine].launch({ executablePath: process.env[`PORTFOLIO_${engine.toUpperCase()}_EXECUTABLE`] })
  const pass = (name) => { results.push({ engine, name, passed: true }); console.log(`PASS ${engine}: ${name}`) }
  try {
    for (const [width, height] of [[320,568],[360,640],[390,844],[430,932],[600,800],[768,1024],[820,1180],[1024,768],[1280,720],[1440,900],[568,320],[844,390]]) {
      const page = await browser.newPage({ viewport: { width, height } })
      await page.goto(base)
      const dialog = page.getByRole('dialog')
      await dialog.waitFor()
      await page.waitForTimeout(1000)
      assert.equal(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 1), true, `Dialog overflow ${width}x${height}`)
      assert.equal(await page.evaluate(() => document.activeElement.closest('dialog') !== null), true)
      assert.equal(await dialog.locator('img').count(), 28, 'All curated merchant assets are present')
      assert.equal(await dialog.locator('img:visible').count(), width <= 700 ? 24 : 28)
      for (const name of ['Skip intro', 'Explore my work']) {
        assert.equal(await page.getByRole('button', { name, exact: name === 'Explore my work' }).evaluate(el => getComputedStyle(el.parentElement).backgroundColor), 'rgb(8, 8, 8)', 'Navigation controls have an opaque surrounding backdrop')
      }
      const images = await dialog.locator('img:visible').evaluateAll(items => items.map(el => ({ loaded: el.complete && el.naturalWidth > 0, src: el.src })))
      assert.ok(images.length >= 8)
      assert.ok(images.every(item => item.loaded), JSON.stringify(images))
      assert.equal(await dialog.locator('img:visible').evaluateAll(items => items.every(el => { const image = el.getBoundingClientRect(); const card = el.parentElement.getBoundingClientRect(); return image.top >= card.top && image.bottom <= card.bottom + 1 && image.left >= card.left && image.right <= card.right + 1 })), true, 'Every logo preserves its bounds within the moving field')
      if (width <= 700) {
        const protection = await dialog.locator('h2').evaluate(el => {
          const story = el.parentElement
          return { background: getComputedStyle(story).backgroundColor, guard: getComputedStyle(story, '::before').backgroundImage }
        })
        assert.equal(protection.background, 'rgb(8, 8, 8)', 'Phone text has an opaque backdrop throughout the animation')
        assert.ok(protection.guard.includes('32px'), 'The opaque backdrop extends beyond the decision labels')
      }
      const skip = page.getByRole('button', { name: 'Skip intro' })
      const box = await skip.boundingBox()
      assert.ok(box.x >= 0 && box.x + box.width <= width + 1 && box.y >= 0 && box.y + box.height <= height)
      assert.ok(box.height >= 44)
      if ([320,390,430,1280,844].includes(width)) await page.screenshot({ path: `${output}/${engine}-${width}.png` })
      await skip.click()
      assert.equal(await dialog.count(), 0)
      assert.equal(await page.evaluate(() => document.activeElement.id), 'main-content')
      assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden')
      await page.close()
      pass(`opening, assets, dismissal and focus ${width}x${height}`)
    }
    const page = await browser.newPage()
    await page.goto(base)
    await page.getByRole('dialog').waitFor()
    await page.keyboard.press('Tab')
    assert.equal(await page.evaluate(() => document.activeElement.textContent.includes('Explore my work')), true)
    await page.keyboard.press('Tab')
    assert.equal(await page.evaluate(() => document.activeElement.textContent.includes('Skip intro')), true)
    await page.keyboard.press('Escape')
    await page.getByRole('dialog').waitFor({ state: 'hidden' })
    await page.goto(base + '/work')
    assert.equal(await page.getByRole('dialog').count(), 0)
    await page.reload()
    await page.getByRole('dialog').waitFor()
    await page.getByRole('button', { name: 'Explore my work' }).click()
    await page.goBack()
    assert.equal(await page.getByRole('dialog').count(), 0)
    pass('keyboard trap, Escape, revisit, reload and Back')
    await page.close()

    const motionPage = await browser.newPage({ viewport: { width: 390, height: 844 } })
    await motionPage.goto(base)
    await motionPage.getByRole('dialog').waitFor()
    await motionPage.waitForTimeout(900)
    const early = await motionPage.locator('dialog img').first().boundingBox()
    await motionPage.waitForTimeout(1400)
    const late = await motionPage.locator('dialog img').first().boundingBox()
    assert.ok(late.width > early.width * 1.25, 'Brand field visibly magnifies')
    assert.equal(await motionPage.getByRole('dialog').evaluate(el => el.scrollWidth <= el.clientWidth + 1), true)
    await motionPage.screenshot({ path: `${output}/${engine}-magnified.png` })
    await motionPage.getByRole('button', { name: 'Skip intro' }).click()
    pass('magnified brand motion preserves viewport and dismissal')
    await motionPage.close()

    const automatic = await browser.newPage()
    await automatic.goto(base)
    await automatic.getByRole('dialog').waitFor()
    await automatic.getByRole('dialog').waitFor({ state: 'hidden', timeout: 5000 })
    assert.notEqual(await automatic.evaluate(() => document.body.style.overflow), 'hidden')
    pass('automatic dismissal under five seconds')
    await automatic.close()

    for (const mode of ['reduced-motion', 'hash', 'no-javascript', 'blocked-storage', 'failed-images', 'text-200']) {
      const p = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: mode === 'reduced-motion' ? 'reduce' : 'no-preference', javaScriptEnabled: mode !== 'no-javascript' })
      if (mode === 'blocked-storage') await p.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage unavailable') } }))
      if (mode === 'failed-images') await p.route('**/brands/**', route => route.abort())
      await p.goto(base + (mode === 'hash' ? '/#production' : '/'))
      if (['reduced-motion','hash','no-javascript'].includes(mode)) {
        await p.waitForTimeout(500)
        assert.equal(await p.getByRole('dialog').count(), 0)
      } else {
        await p.getByRole('dialog').waitFor()
        if (mode === 'text-200') {
          await p.addStyleTag({ content: 'html { font-size: 200% !important; }' })
          assert.equal(await p.getByRole('dialog').evaluate(el => el.scrollWidth <= el.clientWidth + 1), true)
        }
        if (mode === 'failed-images') {
          await p.waitForTimeout(300)
          assert.equal(await p.locator('dialog img:visible').count(), 0)
          assert.equal(await p.locator('dialog').getByText('Apple', {exact:true}).isVisible(), true)
        }
        await p.getByRole('button', { name: 'Skip intro' }).click()
        await p.getByRole('dialog').waitFor({ state: 'hidden' })
      }
      await p.close()
      pass(mode)
    }
    const access = await browser.newPage({ viewport: { width: 390, height: 844 } })
    await access.goto(base)
    await access.getByRole('dialog').waitFor()
    await access.addScriptTag({ content: axe.source })
    await access.waitForTimeout(1100)
    const audit = await access.evaluate(async () => window.axe.run(document.querySelector('dialog'), { runOnly: {type:'tag', values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']} }))
    assert.deepEqual(audit.violations.map(v => ({id:v.id,nodes:v.nodes.map(n=>n.target)})), [])
    await access.emulateMedia({ reducedMotion: 'reduce' })
    await access.getByRole('dialog').waitFor({state:'hidden'})
    pass('opening accessibility and live reduced-motion preference')
    await access.close()
  } finally { await browser.close(); await writeFile(output + '/results.json', JSON.stringify(results, null, 2)) }
}
console.log(`PASS ${results.length} opening checks`)
