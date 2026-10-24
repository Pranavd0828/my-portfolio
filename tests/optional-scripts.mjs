import assert from 'node:assert/strict'
import { chromium, webkit } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:3021'
assert.match(base, /^http:\/\/(127\.0\.0\.1|localhost):\d+$/)
const output =
  process.env.PORTFOLIO_BROWSER_OUTPUT || '/tmp/portfolio-optional-scripts'
await mkdir(output, { recursive: true })
const expectedScripts = [
  '/_vercel/insights/script.js',
  '/_vercel/speed-insights/script.js',
]
const results = []

for (const engine of ['chromium', 'webkit']) {
  const browser = await { chromium, webkit }[engine].launch({
    executablePath: process.env[`PORTFOLIO_${engine.toUpperCase()}_EXECUTABLE`],
  })
  try {
    for (const width of [390, 1440]) {
      for (const failure of ['blocked', 'unavailable']) {
        const context = await browser.newContext({
          viewport: { width, height: 900 },
          reducedMotion: 'reduce',
        })
        const requestedScripts = new Set()
        const unexpectedExternal = []
        let contactSubmissions = 0
        await context.route('**/*', async (route) => {
          const url = new URL(route.request().url())
          if (url.origin === base) {
            if (expectedScripts.includes(url.pathname)) {
              requestedScripts.add(url.pathname)
              if (failure === 'blocked') return route.abort('blockedbyclient')
              return route.fulfill({
                status: 503,
                contentType: 'text/plain',
                body: 'Local simulated optional script outage',
              })
            }
            return route.continue()
          }
          if (url.origin === 'https://formspree.io') {
            contactSubmissions++
            return route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: '{"ok":true}',
            })
          }
          unexpectedExternal.push(url.origin)
          return route.abort()
        })
        const page = await context.newPage()
        const errors = []
        page.on('pageerror', (error) => errors.push(error.message))
        await page.goto(base, { waitUntil: 'networkidle' })
        assert.deepEqual(
          [...requestedScripts].sort(),
          [...expectedScripts].sort(),
          'Both production integrations must request scripts before this test can pass. Build with VERCEL_ENV=production.'
        )
        assert.ok(
          await page
            .getByRole('heading', { name: 'Pranav Deo.', exact: true })
            .isVisible()
        )
        assert.match(
          await page
            .locator('body')
            .evaluate((el) => getComputedStyle(el).fontFamily),
          /inter/i
        )
        async function navigate(name) {
          if (width < 1024)
            await page
              .getByRole('button', { name: 'Menu', exact: true })
              .click()
          await page
            .locator('#main-navigation')
            .getByRole('link', { name, exact: true })
            .click()
        }
        await navigate('Work')
        await page.waitForURL(base + '/work')
        await page
          .locator('main a[href="/work/rakuten-programmatic-loyalty"]')
          .first()
          .click()
        await page
          .locator('#explore-model select')
          .nth(1)
          .selectOption('exhausted')
        assert.match(
          await page.locator('#explore-model [aria-live]').innerText(),
          /Hold delivery/
        )
        await page.getByRole('button', { name: 'Reset example' }).click()
        assert.equal(
          await page.locator('#explore-model select').nth(1).inputValue(),
          'available'
        )

        await page.goto(base + '/work/whatsapp-regional-voice')
        await page.evaluate(() => {
          window.mediaEvents = []
          const video = document.querySelector('video')
          for (const event of [
            'play',
            'pause',
            'playing',
            'loadedmetadata',
            'error',
          ]) {
            video.addEventListener(event, () =>
              window.mediaEvents.push({
                event,
                time: video.currentTime,
                paused: video.paused,
              })
            )
          }
        })
        await page
          .getByRole('button', { name: 'Play preview', exact: true })
          .click()
        try {
          await page.waitForFunction(
            () => document.querySelector('video').currentTime > 0,
            null,
            { timeout: 10000 }
          )
        } catch (error) {
          const media = await page.locator('video').evaluate((video) => ({
            events: window.mediaEvents,
            paused: video.paused,
            readyState: video.readyState,
            error: video.error?.message,
            bounds: video.getBoundingClientRect().toJSON(),
            hidden: document.hidden,
          }))
          await page.screenshot({ path: output + '/media-failure.png' })
          await writeFile(
            output + '/media-failure.json',
            JSON.stringify({ engine, width, failure, media }, null, 2)
          )
          throw error
        }
        await page.locator('.footer').scrollIntoViewIfNeeded()
        await page.waitForFunction(() => document.querySelector('video').paused)
        await page.locator('video').scrollIntoViewIfNeeded()
        await page.evaluate(
          () =>
            new Promise((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(resolve))
            )
        )
        assert.equal(
          await page.locator('video').evaluate((video) => video.paused),
          true,
          'Reduced motion prevents automatic resume after leaving the video'
        )
        await page
          .getByRole('button', { name: 'Play preview', exact: true })
          .click()
        await page.waitForFunction(
          () => !document.querySelector('video').paused
        )
        await page
          .getByRole('button', { name: 'Pause preview', exact: true })
          .click()
        await page
          .getByRole('button', { name: 'Unmute preview', exact: true })
          .click()
        assert.deepEqual(
          await page.locator('video').evaluate((video) => ({
            paused: video.paused,
            muted: video.muted,
          })),
          { paused: true, muted: false }
        )
        await page
          .getByRole('button', { name: 'Mute preview', exact: true })
          .click()

        await navigate('Contact')
        await page.getByLabel('Name', { exact: true }).fill('Local validation')
        await page.getByLabel('Email', { exact: true }).fill('test@example.com')
        await page
          .getByLabel('What would you like to talk about?')
          .fill('Intercepted local validation. No message is sent.')
        await page
          .getByRole('button', { name: 'Send message', exact: true })
          .click()
        await page
          .getByText('Thank you. Your message has been sent.', { exact: true })
          .waitFor()
        assert.equal(contactSubmissions, 1)
        assert.deepEqual(errors, [], 'No uncaught application exceptions')
        assert.deepEqual(
          unexpectedExternal,
          [],
          'No unexpected external traffic attempted'
        )
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1
          )
        )
        results.push({
          engine,
          browser: browser.version(),
          width,
          failure,
          requestedScripts: [...requestedScripts],
          checks: [
            'identity and local font',
            'menu and case navigation',
            'model controls',
            'video and sound controls',
            'explicit play with reduced motion and offscreen pause',
            'intercepted contact success',
            'no page exceptions or overflow',
          ],
          externalMessagesSent: 0,
        })
        await context.close()
      }
    }
  } finally {
    await browser.close()
    await writeFile(
      output + '/optional-scripts.json',
      JSON.stringify({ results }, null, 2)
    )
  }
}
console.log(JSON.stringify({ scenarios: results.length, results }, null, 2))
