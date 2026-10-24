import assert from 'node:assert/strict'
import { chromium, webkit } from 'playwright'
const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:3020'
assert.match(base, /^http:\/\/(127\.0\.0\.1|localhost):\d+$/)
const engine = process.env.PORTFOLIO_BROWSERS || 'chromium'
const browser = await { chromium, webkit }[engine].launch({
  executablePath: process.env[`PORTFOLIO_${engine.toUpperCase()}_EXECUTABLE`],
})
try {
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    await page.goto(base)
    await page
      .getByRole('link', { name: 'Explore my work', exact: true })
      .click()
    await page.waitForURL('**/#production')
    await page
      .locator('#production')
      .getByRole('link', { name: /Read the case study/ })
      .first()
      .click()
    await page.waitForURL('**/work/rakuten-programmatic-loyalty')
    await page.goBack()
    await page.waitForURL('**/#production')
    await page.goForward()
    await page.waitForURL('**/work/rakuten-programmatic-loyalty')
    await page.reload()
    await page.goBack()
    await page.waitForURL('**/#production')
    const video = page.locator('video[src="/videos/regional-voice.mp4"]')
    await video.scrollIntoViewIfNeeded()
    await page.waitForFunction(() => {
      const el = document.querySelector(
        'video[src="/videos/regional-voice.mp4"]'
      )
      return !el.paused && el.currentTime > 0
    })
    const frame = video.locator('..')
    await frame
      .getByRole('button', { name: 'Pause preview', exact: true })
      .click()
    await frame
      .getByRole('button', { name: 'Play preview', exact: true })
      .waitFor()
    await frame
      .getByRole('button', { name: 'Unmute preview', exact: true })
      .click()
    assert.equal(
      await video.evaluate((el) => el.paused),
      true,
      'Changing sound preserves a deliberate pause'
    )
    assert.equal(await video.evaluate((el) => el.muted), false)
    await frame
      .getByRole('button', { name: 'Mute preview', exact: true })
      .click()
    await frame
      .getByRole('button', { name: 'Play preview', exact: true })
      .click()
    await frame
      .getByRole('button', { name: 'Pause preview', exact: true })
      .waitFor()
    await page.locator('#connect').scrollIntoViewIfNeeded()
    await page.waitForFunction(
      () =>
        document.querySelector('video[src="/videos/regional-voice.mp4"]').paused
    )
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await video.scrollIntoViewIfNeeded()
    // Media-query changes and intersection callbacks arrive asynchronously.
    await page.waitForFunction(() =>
      matchMedia('(prefers-reduced-motion: reduce)').matches &&
      document.querySelector('video[src="/videos/regional-voice.mp4"]').paused
    )
    assert.equal(await video.evaluate((el) => el.paused), true)
    await frame
      .getByRole('button', { name: 'Play preview', exact: true })
      .click()
    await frame
      .getByRole('button', { name: 'Pause preview', exact: true })
      .waitFor()
    console.log(
      `PASS ${engine} ${width}: discover work, case study, back navigation, playback, sound, pause, offscreen, reduced motion`
    )
    await page.close()
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  await page.goto(base)
  await page.keyboard.press('Tab')
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent),
    'Skip to content'
  )
  await page.keyboard.press('Enter')
  assert.equal(
    await page.evaluate(() => document.activeElement.id),
    'main-content'
  )
  console.log(`PASS ${engine}: keyboard skip navigation`)
} finally {
  await browser.close()
}
