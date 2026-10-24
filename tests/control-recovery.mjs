import assert from 'node:assert/strict'
import { chromium, webkit } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:3020'
assert.match(base, /^http:\/\/(127\.0\.0\.1|localhost):\d+$/)
const output =
  process.env.PORTFOLIO_BROWSER_OUTPUT || '/tmp/portfolio-control-recovery'
await mkdir(output, { recursive: true })
const results = []
for (const engine of ['chromium', 'webkit']) {
  const browser = await { chromium, webkit }[engine].launch({
    executablePath: process.env[`PORTFOLIO_${engine.toUpperCase()}_EXECUTABLE`],
  })
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' })
    for (const [width, height] of [
      [320, 568],
      [390, 844],
      [844, 390],
      [1440, 900],
    ]) {
      await page.setViewportSize({ width, height })
      await page.goto(base + '/reading')
      const book = page.locator('.book-row details').first()
      assert.match(await book.locator('summary').innerText(), /View cover/)
      await book.locator('summary').click()
      assert.match(await book.locator('summary').innerText(), /Hide cover/)
      assert.ok(await book.locator('img').isVisible())
      await book.locator('img').evaluate((image) => image.decode())
      await book.locator('summary').press('Enter')
      assert.match(await book.locator('summary').innerText(), /View cover/)
      assert.equal(await book.locator('img').isVisible(), false)
      await page.goto(base + '/rpsls')
      await page.getByRole('button', { name: 'rock', exact: true }).click()
      assert.equal(await page.locator('.duel-choice:disabled').count(), 5)
      await page.getByRole('button', { name: 'Play another round' }).click()
      assert.equal(await page.locator('.duel-choice:disabled').count(), 0)
      await page.goto(base + '/escape')
      await page.getByRole('application').focus()
      await page.keyboard.press('Space')
      await page.getByText('SIGNAL LOST', { exact: true }).waitFor()
      for (const label of ['Play again', 'Back to playground']) {
        const button = page.getByRole('button', { name: label, exact: true })
        await button.scrollIntoViewIfNeeded()
        assert.ok(
          await button.evaluate((el) => {
            const r = el.getBoundingClientRect()
            return (
              r.height >= 44 &&
              r.width >= 44 &&
              el.contains(
                document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)
              )
            )
          }),
          label + ' remains reachable'
        )
      }
      if (engine === 'chromium')
        await page.screenshot({
          path: `${output}/game-result-${width}.png`,
          scale: 'css',
        })
      await page
        .getByRole('button', { name: 'Play again', exact: true })
        .click()
      await page
        .getByRole('button', { name: 'Return to playground', exact: true })
        .waitFor()
      await page
        .getByRole('button', { name: 'Return to playground', exact: true })
        .click()
      await page.waitForURL(base + '/playground')
      await page.goto(base + '/#connect')
      let release
      await page.route('https://formspree.io/**', async (route) => {
        await new Promise((resolve) => {
          release = resolve
        })
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: '{"ok":true}',
        })
      })
      await page.getByLabel('Name', { exact: true }).fill('Local review')
      await page.getByLabel('Email', { exact: true }).fill('test@example.com')
      await page
        .getByLabel('What would you like to talk about?')
        .fill('Intercepted local review. No message is sent.')
      await page
        .getByRole('button', { name: 'Send message', exact: true })
        .click()
      await page
        .getByRole('button', { name: 'Sending…', exact: true })
        .waitFor()
      assert.equal(await page.locator('.contact-form :disabled').count(), 4)
      const pending = await page
        .locator('.contact-form :disabled')
        .evaluateAll((elements) =>
          elements.map((element) => ({
            tag: element.tagName,
            opacity: getComputedStyle(element).opacity,
            color: getComputedStyle(element).color,
            background: getComputedStyle(element).backgroundColor,
          }))
        )
      assert.ok(pending.every((element) => Number(element.opacity) >= 0.5))
      if (engine === 'chromium' && width === 390)
        await page.screenshot({
          path: output + '/contact-pending-390.png',
          scale: 'css',
        })
      release()
      await page
        .getByText('Thank you. Your message has been sent.', { exact: true })
        .waitFor()
      assert.equal(await page.locator('.contact-form :disabled').count(), 0)
      await page.unroute('https://formspree.io/**')
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1
        )
      )
      results.push({
        engine,
        width,
        height,
        pending,
        checks: [
          'cover label reflects disclosure state',
          'keyboard closes cover',
          'disabled game choices reset',
          'game actions reachable',
          'retry and return navigation',
          'pending form is visibly disabled and recovers after simulated success',
        ],
      })
    }
  } finally {
    await browser.close()
    await writeFile(
      output + '/recovery.json',
      JSON.stringify({ results }, null, 2)
    )
  }
}
console.log(JSON.stringify({ scenarios: results.length, results }, null, 2))
