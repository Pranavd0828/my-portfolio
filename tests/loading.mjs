import assert from 'node:assert/strict'
import { chromium, webkit } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:3020'
assert.match(base, /^http:\/\/(127\.0\.0\.1|localhost):\d+$/)
const output = process.env.PORTFOLIO_BROWSER_OUTPUT || '/tmp/portfolio-loading'
await mkdir(output, { recursive: true })
const results = []
for (const engine of ['chromium', 'webkit']) {
  const browser = await { chromium, webkit }[engine].launch({
    executablePath: process.env[`PORTFOLIO_${engine.toUpperCase()}_EXECUTABLE`],
  })
  try {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      reducedMotion: 'reduce',
    })
    let release, requested
    const gate = new Promise((resolve) => {
      release = resolve
    })
    const requestStarted = new Promise((resolve) => {
      requested = resolve
    })
    await page.route('**/videos/*.mp4', async (route) => {
      requested()
      await gate
      await route.continue()
    })
    await page.goto(base + '/work/rescue-offers')
    await page
      .getByRole('button', { name: 'Play preview', exact: true })
      .click()
    await requestStarted
    await page
      .getByRole('button', { name: 'Pause preview', exact: true })
      .click()
    assert.equal(await page.getByRole('slider').isDisabled(), true)
    assert.equal(
      await page.getByText('Preview unavailable.', { exact: false }).count(),
      0
    )
    release()
    await page.waitForFunction(
      () => document.querySelector('video').readyState >= 1
    )
    assert.equal(
      await page.locator('video').evaluate((v) => v.paused),
      true,
      'A slow response does not override the visitor pause'
    )
    assert.equal(await page.locator('video').evaluate((v) => v.muted), true)
    await page
      .getByRole('button', { name: 'Play preview', exact: true })
      .click()
    await page.waitForFunction(
      () => document.querySelector('video').currentTime > 0
    )
    results.push({
      engine,
      passed: true,
      check:
        'Delayed video response preserves poster, disabled timeline, mute, and manual pause; explicit play recovers',
    })
  } finally {
    await browser.close()
  }
}
await writeFile(output + '/loading.json', JSON.stringify(results, null, 2))
console.log(JSON.stringify(results, null, 2))
