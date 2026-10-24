import assert from 'node:assert/strict'
import { chromium, webkit } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { caseStudies } from '../src/content/caseStudies.ts'

const require = createRequire(import.meta.url)
const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:3020'
assert.match(base, /^http:\/\/(127\.0\.0\.1|localhost):\d+$/)
const output = process.env.PORTFOLIO_BROWSER_OUTPUT || '/tmp/portfolio-states'
await mkdir(output, { recursive: true })
const results = []
const scans = []
const routes = [
  '/',
  '/work',
  '/reading',
  '/playground',
  '/escape',
  '/rpsls',
  ...caseStudies.map((s) => '/work/' + s.slug),
]

async function scan(page, label) {
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') })
  const violations = await page.evaluate(async () =>
    (
      await window.axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'],
        },
      })
    ).violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))
  )
  scans.push({ label, violations })
  assert.deepEqual(violations, [], label)
}

for (const engine of ['chromium', 'webkit']) {
  const browser = await { chromium, webkit }[engine].launch({
    executablePath: process.env[`PORTFOLIO_${engine.toUpperCase()}_EXECUTABLE`],
  })
  try {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      reducedMotion: 'reduce',
    })
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(base + '/work/whatsapp-regional-voice')
      const video = page.locator('video')
      const slider = page.getByRole('slider', { name: 'Seek preview' })
      assert.equal(
        await slider.isDisabled(),
        true,
        'Metadata is deferred before manual playback'
      )
      await video.scrollIntoViewIfNeeded()
      await page
        .getByRole('button', { name: 'Play preview', exact: true })
        .click()
      await page.waitForFunction(
        () => document.querySelector('video').currentTime > 0
      )
      await page
        .getByRole('button', { name: 'Pause preview', exact: true })
        .click()
      await slider.focus()
      await page.keyboard.press('Home')
      await page.keyboard.press('ArrowRight')
      assert.ok(
        Math.abs((await video.evaluate((v) => v.currentTime)) - 0.1) < 0.15
      )
      assert.equal(
        await video.evaluate((v) => v.paused),
        true,
        'Keyboard seeking preserves pause'
      )
      await page.keyboard.press('End')
      assert.ok(
        await video.evaluate((v) => Math.abs(v.duration - v.currentTime) < 0.2)
      )
      await page.keyboard.press('Home')
      await page
        .getByRole('button', { name: 'Unmute preview', exact: true })
        .click()
      assert.equal(await video.evaluate((v) => v.muted), false)
      assert.equal(await video.evaluate((v) => v.paused), true)
      for (const control of await video
        .locator('..')
        .getByRole('button')
        .all()) {
        await control.scrollIntoViewIfNeeded()
        assert.equal(
          await control.evaluate((el) => {
            const r = el.getBoundingClientRect()
            return (
              r.width >= 44 &&
              r.height >= 44 &&
              [
                [0.5, 0.5],
                [0.25, 0.5],
                [0.75, 0.5],
                [0.5, 0.25],
                [0.5, 0.75],
              ].every(([x, y]) =>
                el.contains(
                  document.elementFromPoint(
                    r.left + r.width * x,
                    r.top + r.height * y
                  )
                )
              )
            )
          }),
          true,
          'Playback controls remain reachable within their circular targets'
        )
      }
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1
        )
      )
      if (width === 390) {
        await slider.focus()
        await page.screenshot({
          path: `${output}/${engine}-timeline-phone.png`,
        })
      }
      results.push(
        `${engine} ${width}: keyboard seek, paused sound change, target hit areas, no overflow`
      )
    }

    // Deny one autoplay attempt without changing browser security or permissions.
    const denied = await browser.newPage({
      viewport: { width: 390, height: 844 },
    })
    await denied.addInitScript(() => {
      const play = HTMLMediaElement.prototype.play
      let first = true
      HTMLMediaElement.prototype.play = function () {
        if (first) {
          first = false
          return Promise.reject(
            new DOMException('Test autoplay denial', 'NotAllowedError')
          )
        }
        return play.call(this)
      }
    })
    await denied.goto(base + '/work/maps-meet-mode')
    await denied.locator('video').scrollIntoViewIfNeeded()
    await denied
      .getByRole('button', { name: 'Play preview', exact: true })
      .click()
    await denied.waitForFunction(
      () => document.querySelector('video').currentTime > 0
    )
    results.push(`${engine}: denied autoplay recovers through explicit play`)
    await denied.close()

    await page.route('**/videos/*.mp4', (r) =>
      r.fulfill({
        status: 200,
        contentType: 'video/mp4',
        body: 'Invalid media bytes for local decoder recovery validation',
      })
    )
    await page.goto(base + '/work/maps-meet-mode')
    await page
      .getByRole('button', { name: 'Play preview', exact: true })
      .click()
    await page.getByText('Preview unavailable.', { exact: false }).waitFor()
    assert.equal(await page.getByRole('slider').isDisabled(), true)
    await page.unroute('**/videos/*.mp4')
    await page
      .getByRole('button', { name: 'Play preview', exact: true })
      .click()
    await page.waitForFunction(
      () => document.querySelector('video').currentTime > 0
    )
    results.push(
      `${engine}: corrupt media produces fallback and recovers on retry`
    )

    if (engine === 'chromium') {
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        for (const route of routes) {
          await page.goto(base + route)
          while (
            await page.locator('details:not([open]) > summary:visible').count()
          )
            await page
              .locator('details:not([open]) > summary:visible')
              .first()
              .click()
          await scan(page, `${route} expanded ${width}`)
          if (route === '/rpsls') {
            await page
              .getByRole('button', { name: 'rock', exact: true })
              .click()
            await scan(page, `Game round result ${width}`)
          }
          if (route === '/escape') {
            await page.getByRole('application').focus()
            await page.keyboard.press('Space')
            await page.getByText('SIGNAL LOST', { exact: true }).waitFor()
            await scan(page, `Runner game over ${width}`)
          }
          if (route === '/work/rakuten-ai-platform') {
            await page
              .getByRole('button', { name: 'Unsupported product claim' })
              .click()
            await scan(page, `Creative review hold ${width}`)
          }
          if (route === '/work/rakuten-programmatic-loyalty') {
            await page
              .locator('#explore-model select')
              .nth(1)
              .selectOption('exhausted')
            await scan(page, `Budget hold ${width}`)
          }
          if (await page.locator('video').count()) {
            await page.route('**/videos/*.mp4', (r) => r.abort())
            await page
              .locator('video')
              .first()
              .locator('..')
              .getByRole('button', { name: 'Play preview', exact: true })
              .click()
            await page
              .getByText('Preview unavailable.', { exact: false })
              .first()
              .waitFor()
            await scan(page, `Failed video ${route} ${width}`)
            await page.unroute('**/videos/*.mp4')
          }
        }
        await page.goto(base + '/reading')
        for (const year of ['2025', '2024']) {
          await page.getByRole('button', { name: year, exact: true }).click()
          while (
            await page.locator('details:not([open]) > summary:visible').count()
          )
            await page
              .locator('details:not([open]) > summary:visible')
              .first()
              .click()
          await scan(page, `Reading ${year} expanded ${width}`)
        }
      }
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 844 })
        await page.goto(base + '/#connect')
        let deliver
        await page.route('https://formspree.io/**', async (r) => {
          await new Promise((resolve) => {
            deliver = resolve
          })
          await r.fulfill({
            status: 200,
            contentType: 'application/json',
            body: '{"ok":true}',
          })
        })
        await page.getByLabel('Name', { exact: true }).fill('Local test')
        await page.getByLabel('Email', { exact: true }).fill('test@example.com')
        await page
          .getByLabel('What would you like to talk about?')
          .fill('Intercepted local test, never sent.')
        await page
          .getByRole('button', { name: 'Send message', exact: true })
          .click()
        await page
          .getByRole('button', { name: 'Sending…', exact: true })
          .waitFor()
        await scan(page, 'Contact pending')
        await page.screenshot({
          path: output + `/contact-pending-${width}.png`,
        })
        deliver()
        await page
          .getByText('Thank you. Your message has been sent.', { exact: true })
          .waitFor()
        assert.equal(
          await page.getByLabel('Name', { exact: true }).inputValue(),
          ''
        )
        await scan(page, 'Contact success')
        await page.screenshot({
          path: output + `/contact-success-${width}.png`,
        })
        await page.unroute('https://formspree.io/**')
        await page.route('https://formspree.io/**', (r) =>
          r.fulfill({ status: 503, body: 'Local simulated provider failure' })
        )
        await page.getByLabel('Name', { exact: true }).fill('Local test')
        await page.getByLabel('Email', { exact: true }).fill('test@example.com')
        await page
          .getByLabel('What would you like to talk about?')
          .fill('Intercepted local recovery test, never sent.')
        await page
          .getByRole('button', { name: 'Send message', exact: true })
          .click()
        await page
          .getByText('I could not confirm delivery.', { exact: false })
          .waitFor()
        await scan(page, `Contact error ${width}`)
        await page.unroute('https://formspree.io/**')
      }
      results.push(
        'Expanded disclosures, reading years, pending and success form states scanned; delivery intercepted'
      )
    }
    await page.close()
  } finally {
    await browser.close()
    await writeFile(
      output + '/states.json',
      JSON.stringify({ results, scans }, null, 2)
    )
  }
}
console.log(
  JSON.stringify(
    { checks: results.length, scans: scans.length, results },
    null,
    2
  )
)
