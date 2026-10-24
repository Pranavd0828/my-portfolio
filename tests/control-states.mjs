import assert from 'node:assert/strict'
import { chromium, webkit } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:3020'
assert.match(base, /^http:\/\/(127\.0\.0\.1|localhost):\d+$/)
const output = process.env.PORTFOLIO_BROWSER_OUTPUT || '/tmp/portfolio-controls'
await mkdir(output, { recursive: true })
const cases = [
  ['primary', '/', '.button-primary', true],
  ['quiet-link', '/', '#about a[class*="quietLink"]'],
  ['home-link', '/', '.wordmark'],
  ['footer-link', '/', '.footer a'],
  ['navigation-link', '/', '#main-navigation a', false, 'menu'],
  ['menu', '/', '.menu-toggle', true, 'phone'],
  ['career-disclosure', '/', '#journey summary'],
  ['prototype-disclosure', '/', '[class*="morePrototypes"] summary'],
  ['video-description', '/', '[class*="demoDescription"] summary'],
  ['contact-input', '/', '#contact-name', true],
  ['contact-textarea', '/', '#contact-message', true],
  ['contact-submit', '/', '.contact-form button', true],
  ['work-link', '/work', '.index-card h3 a'],
  [
    'secondary',
    '/work/whatsapp-catch-up',
    'a.button:not(.button-primary)',
    true,
  ],
  ['text-link', '/work/rakuten-programmatic-loyalty', '.text-link'],
  [
    'case-navigation',
    '/work/rakuten-programmatic-loyalty',
    '.story-toc a:visible',
    false,
    'story',
  ],
  [
    'technical-disclosure',
    '/work/rakuten-programmatic-loyalty',
    '.technical-details summary',
  ],
  [
    'model-select',
    '/work/rakuten-programmatic-loyalty',
    '#explore-model select',
    true,
  ],
  [
    'selected-model',
    '/work/rakuten-ai-platform',
    '#explore-model button[aria-pressed="true"]',
    true,
  ],
  [
    'other-model',
    '/work/rakuten-ai-platform',
    '#explore-model button[aria-pressed="false"]',
    true,
  ],
  [
    'selected-year',
    '/reading',
    '.reading-years button[aria-pressed="true"]',
    true,
  ],
  [
    'other-year',
    '/reading',
    '.reading-years button[aria-pressed="false"]',
    true,
  ],
  ['book-disclosure', '/reading', '.book-row summary'],
  ['game-card', '/playground', '.play-card'],
  ['game-choice', '/rpsls', '.duel-choice', true],
  ['escape-back', '/escape', '.escape-back', true],
  ['escape-retry', '/escape', '.escape-result button', true, 'game-over'],
  [
    'escape-return',
    '/escape',
    '.escape-result button:nth-child(2)',
    false,
    'game-over',
  ],
  [
    'media-play',
    '/work/whatsapp-regional-voice',
    'button[aria-label="Play preview"]',
    true,
  ],
  [
    'media-sound',
    '/work/whatsapp-regional-voice',
    'button[aria-label="Unmute preview"]',
    true,
  ],
  [
    'media-bright',
    '/work/maps-meet-mode',
    'button[aria-label="Play preview"]',
    true,
  ],
]
const results = [],
  failures = [],
  images = []
const filter = process.env.PORTFOLIO_CONTROL_FILTER?.split(',')
const selectedCases = cases.filter(([name]) => !filter || filter.includes(name))
assert.ok(selectedCases.length, 'At least one control family must be selected')

for (const engine of ['chromium', 'webkit']) {
  const browser = await { chromium, webkit }[engine].launch({
    executablePath: process.env[`PORTFOLIO_${engine.toUpperCase()}_EXECUTABLE`],
  })
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' })
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      for (const [
        name,
        route,
        selector,
        boundary = false,
        setup,
      ] of selectedCases) {
        if (setup === 'phone' && width >= 1024) continue
        await page.goto(base + route)
        await page.evaluate(() => document.fonts.ready)
        if (setup === 'menu' && width < 1024)
          await page.getByRole('button', { name: 'Menu', exact: true }).click()
        if (setup === 'story' && width < 1024)
          await page.locator('.story-toc-mobile summary').click()
        if (setup === 'game-over') {
          await page.getByRole('application').focus()
          await page.keyboard.press('Space')
          await page.getByText('SIGNAL LOST', { exact: true }).waitFor()
        }
        const control = page.locator(selector).first()
        await control.scrollIntoViewIfNeeded()
        await page.mouse.move(0, 0)
        const states = []
        for (const state of ['normal', 'hover', 'active', 'focus']) {
          if (state === 'hover') await control.hover()
          if (state === 'active') await page.mouse.down()
          if (state === 'focus') {
            await page.mouse.move(0, 0)
            await page.mouse.up()
            await page.evaluate(() => window.getSelection()?.removeAllRanges())
            await page.keyboard.press('Tab')
            await control.focus()
          }
          // Allow authored color transitions to settle before measuring them.
          await page.waitForTimeout(320)
          const measured = await control.evaluate((element) => {
            // Convert resolved RGB, OKLab, and color() values to sRGB.
            const canvas = document.createElement('canvas')
            canvas.width = canvas.height = 1
            const context = canvas.getContext('2d', {
              willReadFrequently: true,
            })
            function rgba(value) {
              context.clearRect(0, 0, 1, 1)
              context.fillStyle = value
              context.fillRect(0, 0, 1, 1)
              const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data
              return [r, g, b, a / 255]
            }
            function over(front, back) {
              return [0, 1, 2]
                .map((i) => front[i] * front[3] + back[i] * (1 - front[3]))
                .concat(1)
            }
            function background(node) {
              const chain = []
              for (let n = node; n; n = n.parentElement) chain.unshift(n)
              return chain.reduce(
                (color, n) =>
                  over(rgba(getComputedStyle(n).backgroundColor), color),
                [255, 255, 255, 1]
              )
            }
            function luminance(color) {
              const c = color
                .slice(0, 3)
                .map((n) => n / 255)
                .map((n) =>
                  n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4
                )
              return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722
            }
            function contrast(a, b) {
              const [high, low] = [luminance(a), luminance(b)].sort(
                (a, b) => b - a
              )
              return (high + 0.05) / (low + 0.05)
            }
            const s = getComputedStyle(element),
              bg = background(element),
              outside = background(element.parentElement)
            const text = [element, ...element.querySelectorAll('*')]
              .filter(
                (n) =>
                  n.getClientRects().length &&
                  !n.closest('[aria-hidden="true"],.sr-only') &&
                  ([...n.childNodes].some(
                    (child) => child.nodeType === 3 && child.textContent.trim()
                  ) ||
                    n.matches('input,textarea,select'))
              )
              .map((n) => {
                const style = getComputedStyle(n),
                  bg = background(n)
                return {
                  sample: (
                    n.textContent ||
                    n.getAttribute('aria-label') ||
                    n.tagName
                  )
                    .trim()
                    .slice(0, 60),
                  ratio: contrast(over(rgba(style.color), bg), bg),
                }
              })
            return {
              color: s.color,
              background: s.backgroundColor,
              border: s.borderTopColor,
              borderWidth: parseFloat(s.borderTopWidth),
              boundaryRatio: Math.max(
                contrast(over(rgba(s.borderTopColor), outside), outside),
                contrast(bg, outside)
              ),
              focusVisible: element.matches(':focus-visible'),
              outlineWidth: parseFloat(s.outlineWidth),
              outlineStyle: s.outlineStyle,
              outlineRatio: contrast(
                over(rgba(s.outlineColor), outside),
                outside
              ),
              iconRatio: contrast(over(rgba(s.color), bg), bg),
              text,
            }
          })
          states.push({ state, ...measured })
          const issues = []
          if (measured.text.some((t) => t.ratio < 4.5))
            issues.push('text contrast below 4.5:1')
          if (boundary && measured.boundaryRatio < 3)
            issues.push('control boundary below 3:1')
          if (
            state === 'focus' &&
            (!measured.focusVisible ||
              measured.outlineWidth < 2 ||
              measured.outlineStyle === 'none' ||
              measured.outlineRatio < 3)
          )
            issues.push('keyboard focus needs review')
          if (name.startsWith('media-') && measured.iconRatio < 3)
            issues.push('icon contrast below 3:1')
          if (issues.length)
            failures.push({ engine, width, name, state, issues, measured })
          if (engine === 'chromium' && width === 390) {
            const box = await control.boundingBox()
            const clip = {
              x: Math.max(0, box.x - 9),
              y: Math.max(0, box.y - 9),
              width:
                Math.min(width, box.x + box.width + 9) - Math.max(0, box.x - 9),
              height:
                Math.min(1000, box.y + box.height + 9) - Math.max(0, box.y - 9),
            }
            const file = `${name}-${state}.png`
            const buffer = await page.screenshot({
              path: output + '/' + file,
              clip,
              scale: 'css',
            })
            images.push({ name, state, file, data: buffer.toString('base64') })
          }
        }
        await page.mouse.move(0, 0)
        await page.mouse.up()
        results.push({ engine, width, name, route, states })
      }
    }
  } finally {
    await browser.close()
    await writeFile(
      output + '/controls.json',
      JSON.stringify({ results, failures }, null, 2)
    )
  }
}
// Render actual captured specimens together for manual comparison.
const review = await chromium.launch({
  executablePath: process.env.PORTFOLIO_CHROMIUM_EXECUTABLE,
})
try {
  const page = await review.newPage({ viewport: { width: 1500, height: 1000 } })
  for (let start = 0; start < selectedCases.length; start += 6) {
    const names = selectedCases.slice(start, start + 6).map((c) => c[0])
    const cells = images
      .filter((image) => names.includes(image.name))
      .map(
        (image) =>
          `<figure><figcaption>${image.name}: ${image.state}</figcaption><img src="data:image/png;base64,${image.data}" /></figure>`
      )
      .join('')
    await page.setContent(
      `<html><style>body{margin:20px;background:#181818;color:white;font:14px Arial}main{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}figure{margin:0;background:#080808;padding:8px}figcaption{margin-bottom:12px}img{max-width:100%;height:auto}</style><main>${cells}</main></html>`
    )
    await page.screenshot({
      path: `${output}/review-${start / 6 + 1}.png`,
      fullPage: true,
    })
  }
} finally {
  await review.close()
}
console.log(
  JSON.stringify(
    {
      variants: results.length,
      states: results.reduce((n, r) => n + r.states.length, 0),
      failures: failures.length,
      firstFailures: failures.slice(0, 5),
    },
    null,
    2
  )
)
assert.equal(
  failures.length,
  0,
  'Inspect controls.json and the visual review sheets'
)
