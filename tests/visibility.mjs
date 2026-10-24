import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:3020'
assert.match(base, /^http:\/\/(127\.0\.0\.1|localhost):\d+$/)
const output =
  process.env.PORTFOLIO_BROWSER_OUTPUT || '/tmp/portfolio-visibility'
await mkdir(output, { recursive: true })
// A headed browser is required: the test must observe genuine tab visibility.
const browser = await chromium.launch({
  headless: false,
  ignoreDefaultArgs: [
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-background-timer-throttling',
  ],
  executablePath: process.env.PORTFOLIO_CHROMIUM_EXECUTABLE,
})
const results = []
try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  // Playwright enables focus emulation by default. Restore native visibility
  // rather than replacing document.hidden or dispatching a synthetic event.
  const pageSession = await context.newCDPSession(page)
  await pageSession.send('Emulation.setFocusEmulationEnabled', {
    enabled: false,
  })
  await page.goto(base + '/work/whatsapp-regional-voice')
  const video = page.locator('video')
  await video.scrollIntoViewIfNeeded()
  await page.bringToFront()
  await page.waitForFunction(
    () => !document.hidden && !document.querySelector('video').paused
  )
  const other = await context.newPage()
  const otherSession = await context.newCDPSession(other)
  await otherSession.send('Emulation.setFocusEmulationEnabled', {
    enabled: false,
  })
  await other.goto('about:blank')
  async function hideAndCheck(label) {
    await other.bringToFront()
    try {
      await page.waitForFunction(
        () => document.hidden && document.querySelector('video').paused,
        null,
        { timeout: 5000 }
      )
    } catch (error) {
      const observed = await page.evaluate(() => ({
        hidden: document.hidden,
        visibility: document.visibilityState,
        paused: document.querySelector('video').paused,
      }))
      await writeFile(
        output + '/visibility.json',
        JSON.stringify(
          {
            browser: browser.version(),
            passed: false,
            label,
            observed,
            reason: 'The required real hidden-tab state was not observed.',
          },
          null,
          2
        )
      )
      throw error
    }
    const before = await video.evaluate((v) => v.currentTime)
    await page.waitForTimeout(500)
    const after = await video.evaluate((v) => v.currentTime)
    assert.ok(
      Math.abs(after - before) < 0.1,
      'Hidden playback time remains stationary'
    )
    results.push({
      label,
      hidden: await page.evaluate(() => document.hidden),
      paused: true,
      elapsedWhileHidden: after - before,
    })
    await page.bringToFront()
    await page.waitForFunction(() => !document.hidden)
  }
  await hideAndCheck('Automatic playback pauses in a hidden tab')
  await page.waitForFunction(() => !document.querySelector('video').paused)
  assert.equal(await video.evaluate((v) => v.muted), true)
  results.push({
    label: 'Returning resumes eligible autoplay silently',
    passed: true,
  })
  await page.getByRole('button', { name: 'Pause preview', exact: true }).click()
  await hideAndCheck('An intentional pause survives a tab switch')
  assert.equal(await video.evaluate((v) => v.paused), true)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.getByRole('button', { name: 'Play preview', exact: true }).click()
  await page.waitForFunction(() => !document.querySelector('video').paused)
  await hideAndCheck(
    'Explicit playback still pauses when hidden under reduced motion'
  )
  assert.equal(await video.evaluate((v) => v.paused), true)
  results.push({
    label: 'Reduced motion prevents automatic resume on return',
    passed: true,
  })
  await writeFile(
    output + '/visibility.json',
    JSON.stringify({ browser: browser.version(), results }, null, 2)
  )
  console.log(JSON.stringify(results, null, 2))
} finally {
  await browser.close()
}
