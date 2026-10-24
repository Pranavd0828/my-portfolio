import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium, firefox, webkit, devices } from 'playwright'
import { caseStudies } from '../src/content/caseStudies.ts'

const base = process.env.PORTFOLIO_TEST_URL ?? 'http://127.0.0.1:3020'
assert.match(
  base,
  /^http:\/\/(127\.0\.0\.1|localhost):\d+$/,
  'Only test a local server.'
)
const engines = { chromium, firefox, webkit }
const selectedEngines = (process.env.PORTFOLIO_BROWSERS ?? 'chromium').split(
  ','
)
const widths = [
  320, 360, 375, 390, 393, 412, 430, 480, 599, 600, 601, 650, 699, 700, 701, 768, 820, 834, 899, 900, 901, 1023, 1024, 1025, 1179, 1180, 1181, 1280, 1440, 1536, 1920,
]
const routes = [
  '/',
  '/work',
  '/reading',
  '/playground',
  '/escape',
  '/rpsls',
  ...caseStudies.map((story) => `/work/${story.slug}`),
]
const report = []
const output = process.env.PORTFOLIO_BROWSER_OUTPUT
if (output) await mkdir(output, { recursive: true })

async function assertLayout(page, label) {
  const dimensions = await page.evaluate(() => ({
    width: window.innerWidth,
    document: document.documentElement.scrollWidth,
  }))
  assert.ok(
    dimensions.document <= dimensions.width + 1,
    `${label}: document overflow ${JSON.stringify(dimensions)}`
  )
  const clipped = await page
    .locator(
      'main h1, main h2, main h3, main p, main a, main button, main input, main textarea, main summary, .site-header a, .site-header button'
    )
    .evaluateAll((elements) =>
      elements.flatMap((element) => {
        const box = element.getBoundingClientRect()
        const style = getComputedStyle(element)
        if (
          !element.getClientRects().length ||
          style.visibility === 'hidden' ||
          element.closest('[aria-hidden="true"]')
        )
          return []
        if (box.width > 0 && (box.right > innerWidth + 2 || box.left < -2))
          return [
            {
              tag: element.tagName,
              text: element.textContent.slice(0, 70),
              left: box.left,
              right: box.right,
            },
          ]
        return []
      })
    )
  assert.deepEqual(
    clipped,
    [],
    `${label}: clipped content ${JSON.stringify(clipped)}`
  )
  assert.equal(
    await page.locator('h1').count(),
    1,
    `${label}: one page heading`
  )
}

for (const name of selectedEngines) {
  assert.ok(engines[name], `Unknown engine: ${name}`)
  const executablePath =
    process.env[`PORTFOLIO_${name.toUpperCase()}_EXECUTABLE`]
  const browser = await engines[name].launch({
    headless: true,
    timeout: 30000,
    ...(executablePath ? { executablePath } : {}),
  })
  const errors = []
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()
  page.on('pageerror', (error) =>
    errors.push({ url: page.url(), message: error.message })
  )
  try {
    await page.goto(base, { waitUntil: 'networkidle' })
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 })
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: 'instant' })
      )
      await assertLayout(page, `${name} home ${width}`)
      await page.evaluate(() =>
        window.scrollTo({
          top: document.body.scrollHeight / 2,
          behavior: 'instant',
        })
      )
      await page.waitForFunction(
        () =>
          Math.abs(
            document.querySelector('.site-header').getBoundingClientRect().top
          ) < 1
      )
      if (width <= 1023) {
        const menu = page.locator('.menu-toggle')
        await menu.click()
        assert.equal(await menu.getAttribute('aria-expanded'), 'true')
        await assertLayout(page, `${name} open menu ${width}`)
        await page.keyboard.press('Escape')
        assert.equal(await menu.getAttribute('aria-expanded'), 'false')
        assert.equal(
          await menu.evaluate((element) => element === document.activeElement),
          true
        )
      }
    }
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(base, { waitUntil: 'networkidle' })
    const featuredQuestions = await page
      .locator('#prototypes article h3 a')
      .allTextContents()
    assert.deepEqual(
      featuredQuestions.slice(0, 3),
      [
        'What makes a meeting place fair for everyone?',
        'Can playback keep its regional character?',
        'Could a canceled order become a useful nearby offer?',
      ],
      `${name}: featured prototype order`
    )
    const previewSources = await page
      .locator('#prototypes video')
      .evaluateAll((videos) => videos.map((video) => video.getAttribute('src')))
    assert.deepEqual(previewSources, [
      '/videos/meet-halfway.mp4',
      '/videos/regional-voice.mp4',
      '/videos/rescue-radar.mp4',
    ])
    const sound = page.getByRole('button', {
      name: 'Unmute preview',
      exact: true,
    })
    await sound.scrollIntoViewIfNeeded()
    const control = await sound.evaluate((el) => {
      const box = el.getBoundingClientRect()
      const hit = document.elementFromPoint(
        box.x + box.width / 2,
        box.y + box.height / 2
      )
      return {
        width: box.width,
        height: box.height,
        reachable: el.contains(hit),
        icon: el.querySelector('svg').getBoundingClientRect().width,
      }
    })
    assert.ok(
      control.width >= 44 &&
        control.height >= 44 &&
        control.reachable &&
        control.icon >= 16,
      'Sound control is visible and reachable'
    )
    const voice = page.locator('video[src="/videos/regional-voice.mp4"]')
    assert.equal(await voice.evaluate((el) => el.muted), true)
    await sound.click()
    assert.equal(await voice.evaluate((el) => el.muted), false)
    await page
      .getByRole('button', { name: 'Mute preview', exact: true })
      .click()
    assert.equal(await voice.evaluate((el) => el.muted), true)
    const fontFamilies = await page
      .locator('main h1, main h2, main h3, main p, main a, main button')
      .evaluateAll((elements) => [
        ...new Set(
          elements.map((element) => getComputedStyle(element).fontFamily)
        ),
      ])
    assert.equal(
      fontFamilies.length,
      1,
      `${name}: consistent portfolio font family ${JSON.stringify(fontFamilies)}`
    )
    report.push({
      engine: name,
      check: 'home resize, header, menu, keyboard focus',
      widths,
      passed: true,
    })

    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      for (const route of routes) {
        const response = await page.goto(base + route, {
          waitUntil: 'networkidle',
        })
        assert.ok(
          [200, 304].includes(response.status()),
          `${name} ${route}: response ${response.status()}`
        )
        await assertLayout(page, `${name} ${route} ${width}`)
        const text = await page.locator('body').innerText()
        assert.ok(
          !text.includes(String.fromCharCode(0x2014)),
          `${name} ${route}: punctuation rule`
        )
        assert.ok(
          !/\b(?:I['’](?:m|ve|ll|d)|(?:we|you|they)['’](?:re|ve|ll|d)|(?:it|that|there|here|what)['’]s|let['’]s|[a-z]+n['’]t)\b/i.test(
            text
          ),
          `${name} ${route}: full word forms`
        )
        const decoratedLinks = await page
          .locator('a')
          .evaluateAll((links) =>
            links
              .filter((link) => /[↗↘]/.test(link.textContent))
              .map((link) => link.textContent)
          )
        assert.deepEqual(
          decoratedLinks,
          [],
          `${name} ${route}: decorative link arrows`
        )
      }
    }
    report.push({
      engine: name,
      check: 'all routes, layout, headings, writing rules, link arrows',
      routes: routes.length,
      widths: [375, 768, 1440],
      passed: true,
    })

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(base)
    const navigation = await page
      .locator('.nav-links a')
      .evaluateAll((links) =>
        links
          .filter((link) => !link.classList.contains('desktop-resume'))
          .map((link) => link.getAttribute('href'))
      )
    for (const href of navigation) {
      await page.goto(base)
      await page.getByRole('button', { name: 'Menu', exact: true }).click()
      await page.locator(`.nav-links a[href="${href}"]`).click()
      const expected = new URL(href, base)
      await page.waitForURL(
        (url) =>
          url.pathname === expected.pathname && url.hash === expected.hash
      )
      assert.equal(
        await page.locator('.menu-toggle').getAttribute('aria-expanded'),
        'false'
      )
      if (expected.hash) {
        await page.waitForFunction((id) => {
          const box = document.getElementById(id).getBoundingClientRect()
          return (
            box.top >=
              document.querySelector('.site-header').getBoundingClientRect()
                .bottom -
                1 && box.top < 200
          )
        }, expected.hash.slice(1))
      }
    }
    report.push({
      engine: name,
      check: 'every mobile menu destination and anchor position',
      links: navigation.length,
      passed: true,
    })

    for (const width of [320, 390, 650, 768, 1023, 1024, 1440]) {
      await page.setViewportSize({ width, height: 700 })
      await page.goto(base + '/work/rakuten-programmatic-loyalty', {
        waitUntil: 'networkidle',
      })
      const position = await page
        .locator('.story-body')
        .evaluate(
          (element) => element.getBoundingClientRect().top + scrollY + 700
        )
      await page.evaluate(
        (y) => window.scrollTo({ top: y, behavior: 'instant' }),
        position
      )
      if (width < 1024) {
        await page.waitForFunction(
          () =>
            Math.abs(
              document.querySelector('.story-toc').getBoundingClientRect().top -
                document.querySelector('.site-header').getBoundingClientRect()
                  .bottom
            ) < 2
        )
        await page.locator('.story-toc-mobile summary').click()
        const menuBox = await page
          .locator('.story-toc-mobile nav')
          .boundingBox()
        assert.ok(
          menuBox.y + menuBox.height <= 702,
          'Story menu stays inside the viewport'
        )
        await page.locator('.story-toc-mobile a[href="#decision"]').click()
        assert.equal(
          await page.locator('.story-toc-mobile').getAttribute('open'),
          null
        )
        await page.waitForFunction(() => {
          const top = document
            .getElementById('decision')
            .getBoundingClientRect().top
          return (
            top >=
              document.querySelector('.story-toc').getBoundingClientRect()
                .bottom -
                1 && top < 220
          )
        })
        await page.locator('.story-toc-mobile summary').click()
        await page
          .locator('.story-toc-mobile a[href="#implementation"]')
          .click()
        await page.waitForFunction(
          () =>
            document.getElementById('implementation').getBoundingClientRect()
              .top >=
            document.querySelector('.story-toc').getBoundingClientRect()
              .bottom -
              1
        )
      } else {
        const top = await page
          .locator('.story-toc-desktop')
          .evaluate((element) => element.getBoundingClientRect().top)
        assert.ok(
          Math.abs(top - 100) < 2,
          `Desktop story navigation remains pinned: ${top}`
        )
      }
    }
    report.push({
      engine: name,
      check: 'story navigation scroll, menu bounds, and anchor clearance',
      passed: true,
    })

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(base)
    const prototypeDetails = page.locator('#prototypes details').filter({hasText: 'There is more on the workbench'})
    await prototypeDetails.locator('summary').click()
    assert.notEqual(await prototypeDetails.getAttribute('open'), null)
    assert.equal(await prototypeDetails.locator('article').count(), 5)
    const visibleStories = await page.locator('#prototypes h3 a').count()
    assert.equal(visibleStories, 8)
    for (const details of await page.locator('#journey details').all()) {
      await details.locator('summary').click()
      assert.notEqual(await details.getAttribute('open'), null)
      await details.locator('summary').click()
    }
    await prototypeDetails.locator('summary').click()
    const media = page.locator('#prototypes img, figure img')
    for (const image of await media.all()) {
      await image.scrollIntoViewIfNeeded()
      await page.waitForFunction(
        (element) => element.complete && element.naturalWidth > 0,
        await image.elementHandle()
      )
      assert.ok(await image.evaluate((element) => element.naturalWidth > 0))
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.keyboard.press('Tab')
    await page.locator('.skip-link').focus()
    await page.keyboard.press('Enter')
    assert.equal(
      await page.evaluate(() => document.activeElement.id),
      'main-content'
    )
    report.push({
      engine: name,
      check:
        'all prototypes, career disclosures, image loading, skip navigation',
      passed: true,
    })

    await page.route('https://formspree.io/**', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: '{}',
      })
    )
    await page.locator('#contact-name').fill('Local preview test')
    await page.locator('#contact-email').fill('preview@example.com')
    await page
      .locator('#contact-message')
      .fill('Local test. No message is sent.')
    await page
      .getByRole('button', { name: 'Send message', exact: true })
      .click()
    await page
      .getByRole('status')
      .filter({ hasText: 'I could not confirm delivery.' })
      .waitFor()
    assert.equal(
      await page.locator('#contact-message').inputValue(),
      'Local test. No message is sent.'
    )
    await page.unroute('https://formspree.io/**')
    await page.route('https://formspree.io/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{"ok":true}',
      })
    )
    await page
      .getByRole('button', { name: 'Send message', exact: true })
      .click()
    await page
      .getByRole('status')
      .filter({ hasText: 'Thank you. Your message has been sent.' })
      .waitFor()
    assert.equal(await page.locator('#contact-message').inputValue(), '')
    report.push({
      engine: name,
      check:
        'contact error preservation and success reset using intercepted requests only',
      passed: true,
    })

    if (output) {
      for (const width of [390, 768, 1440]) {
        await page.setViewportSize({
          width,
          height: width === 390 ? 844 : 1000,
        })
        await page.goto(base, { waitUntil: 'networkidle' })
        for (const image of await page
          .locator('#prototypes img, figure img')
          .all()) {
          await image.scrollIntoViewIfNeeded()
          await page.waitForFunction(
            (element) => element.complete && element.naturalWidth > 0,
            await image.elementHandle()
          )
        }
        await page.evaluate(() =>
          window.scrollTo({ top: 0, behavior: 'instant' })
        )
        await page.screenshot({
          path: `${output}/${name}-opening-${width}.png`,
        })
        await page.screenshot({
          path: `${output}/${name}-home-${width}.png`,
          fullPage: true,
        })
      }
    }
    if (name !== 'firefox') {
      for (const device of ['iPhone 13', 'iPad (gen 7)']) {
        const mobileContext = await browser.newContext({
          ...devices[device],
          reducedMotion: 'reduce',
        })
        const mobilePage = await mobileContext.newPage()
        mobilePage.on('pageerror', (error) =>
          errors.push({ device, message: error.message })
        )
        await mobilePage.goto(base, { waitUntil: 'networkidle' })
        await assertLayout(mobilePage, `${name} ${device}`)
        await mobilePage
          .getByRole('button', { name: 'Menu', exact: true })
          .tap()
        await mobilePage.locator('.nav-links a[href="/#prototypes"]').tap()
        await mobilePage.waitForURL('**/#prototypes')
        assert.equal(
          await mobilePage
            .locator('.menu-toggle')
            .getAttribute('aria-expanded'),
          'false'
        )
        await mobilePage.setViewportSize({
          width: devices[device].viewport.height,
          height: devices[device].viewport.width,
        })
        await assertLayout(mobilePage, `${name} ${device} landscape`)
        await mobileContext.close()
      }
      report.push({
        engine: name,
        check:
          'iPhone and iPad emulation, touch menu navigation, portrait and landscape',
        passed: true,
      })
    }
    assert.deepEqual(errors, [], `${name}: browser exceptions`)
    console.log(
      `PASS ${name} ${browser.version()}: route, resize, navigation, media, writing, and contact checks.`
    )
  } finally {
    await context.close()
    await browser.close()
    if (output)
      await writeFile(`${output}/results.json`, JSON.stringify(report, null, 2))
  }
}
console.log(
  `PASS ${report.length} browser check groups. No contact message was sent.`
)
