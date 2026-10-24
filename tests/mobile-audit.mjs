import { chromium, webkit, devices } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { caseStudies } from '../src/content/caseStudies.ts'
import assert from 'node:assert/strict'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:3020'
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base))
  throw Error('Local preview required')
const engine = process.env.PORTFOLIO_BROWSERS || 'chromium'
const output =
  process.env.PORTFOLIO_BROWSER_OUTPUT ||
  join(tmpdir(), 'portfolio-mobile-audit')
await mkdir(output, { recursive: true })
const browser = await { chromium, webkit }[engine].launch({
  executablePath: process.env[`PORTFOLIO_${engine.toUpperCase()}_EXECUTABLE`],
})
const routes = [
  '/',
  '/work',
  '/reading',
  '/playground',
  '/escape',
  '/rpsls',
  ...caseStudies.map((s) => `/work/${s.slug}`),
]
const failures = []
const checks = []
const context = await browser.newContext({
  ...devices['iPhone 13'],
  reducedMotion: 'reduce',
})
const page = await context.newPage()
page.on('pageerror', (error) =>
  failures.push({ kind: 'exception', message: error.message })
)
page.on('response', (response) => {
  if (
    response.url().startsWith(base + '/_next/static/') &&
    response.status() >= 400
  )
    failures.push({
      kind: 'asset',
      url: response.url(),
      status: response.status(),
    })
})

async function inspect(label) {
  const result = await page.evaluate(() => {
    const header = document
      .querySelector('.site-header')
      .getBoundingClientRect()
    const text = []
    for (const element of document.querySelectorAll(
      'h1,h2,h3,h4,p,li,dt,dd,summary,button,a,input,textarea,.escape-game span'
    )) {
      if (
        !element.checkVisibility() ||
        element.closest('[aria-hidden="true"],.sr-only,.skip-link')
      )
        continue
      const box = element.getBoundingClientRect()
      if (
        box.width &&
        (box.left < -1 ||
          box.right > innerWidth + 1 ||
          (element.scrollWidth > element.clientWidth + 2 &&
            box.width > 40 &&
            getComputedStyle(element).textOverflow !== 'ellipsis'))
      )
        text.push({
          tag: element.tagName,
          text: element.textContent.slice(0, 80),
          left: Math.round(box.left),
          right: Math.round(box.right),
          width: element.clientWidth,
          content: element.scrollWidth,
        })
    }
    const brand = document.querySelector('.wordmark').getBoundingClientRect()
    const actions = document
      .querySelector('.mobile-header-actions')
      .getBoundingClientRect()
    const menu = document.querySelector('.menu-toggle').getBoundingClientRect()
    return {
      text,
      headerCollision:
        actions.width > 0 &&
        brand.bottom > actions.top &&
        brand.top < actions.bottom &&
        brand.right + 8 > actions.left,
      headerClipped:
        menu.height > 0 &&
        (menu.bottom > header.bottom + 1 || brand.bottom > header.bottom + 1),
      background: getComputedStyle(document.body).backgroundColor,
      width: innerWidth,
      height: innerHeight,
    }
  })
  if (
    result.text.length ||
    result.headerCollision ||
    result.headerClipped ||
    result.background !== 'rgb(8, 8, 8)'
  )
    failures.push({ label, ...result })
  checks.push(label)
}

try {
  for (const [width, height, textScale] of [
    [320, 568, 100],
    [360, 640, 100],
    [375, 667, 100],
    [412, 740, 100],
    [430, 932, 100],
    [568, 320, 100],
    [667, 375, 100],
    [844, 390, 100],
    [768, 1024, 100],
    [1024, 768, 100],
    [320, 568, 200],
    [390, 844, 200],
  ]) {
    await page.setViewportSize({ width, height })
    for (const route of routes) {
      await page.goto(base + route, { waitUntil: 'load' })
      await page.evaluate(
        (scale) => (document.documentElement.style.fontSize = scale + '%'),
        textScale
      )
      await inspect(`${route} ${width}x${height} text ${textScale}%`)
    }
  }
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [568, 320],
    [768, 1024],
  ]) {
    await page.setViewportSize({ width, height })
    await page.goto(base)
    await page.getByRole('button', { name: 'Menu', exact: true }).tap()
    await inspect(`open menu ${width}x${height}`)
    await page.screenshot({ path: `${output}/${engine}-menu-${width}.png` })
    await page.locator('.nav-links a[href="/#prototypes"]').tap()
    await page.waitForURL('**/#prototypes')
    for (const img of await page.locator('#prototypes img').all())
      await img.scrollIntoViewIfNeeded()
    await page.locator('#prototypes').scrollIntoViewIfNeeded()
    await page.screenshot({
      path: `${output}/${engine}-prototypes-${width}.png`,
    })
    await page.goto(base + '/work/rakuten-programmatic-loyalty#decision')
    await page.screenshot({ path: `${output}/${engine}-decision-${width}.png` })
    await page.goto(base + '/reading')
    for (const year of ['2024', '2025', '2026']) {
      await page.getByRole('button', { name: year, exact: true }).tap()
      await inspect(`reading ${year} ${width}`)
    }
  }
  for (const [width, height, textScale] of [
    [320, 568, 200],
    [568, 320, 200],
    [390, 320, 100],
  ]) {
    await page.setViewportSize({ width, height })
    await page.goto(base)
    await page.evaluate(
      (scale) => (document.documentElement.style.fontSize = scale + '%'),
      textScale
    )
    await page.getByRole('button', { name: 'Menu', exact: true }).tap()
    await inspect(
      `enlarged or short menu ${width}x${height} text ${textScale}%`
    )
    const menuBox = await page.locator('.nav-links').boundingBox()
    assert.ok(
      menuBox.y + menuBox.height <= height + 1,
      'Menu fits available screen height'
    )
    await page.locator('.nav-links a[href="/playground"]').tap()
    await page.waitForURL('**/playground')
    await page.goto(base + '/work/rakuten-programmatic-loyalty#decision')
    await page.evaluate(
      (scale) => (document.documentElement.style.fontSize = scale + '%'),
      textScale
    )
    await page.locator('.story-toc-mobile summary').tap()
    const storyMenu = await page.locator('.story-toc-mobile nav').boundingBox()
    assert.ok(
      storyMenu.y + storyMenu.height <= height + 2,
      `Story menu fits available screen height: ${JSON.stringify({ width, height, textScale, storyMenu })}`
    )
    await page.locator('.story-toc-mobile a').last().tap()
    await page.waitForFunction(() => {
      const target = document.querySelector(location.hash)
      const nav = document.querySelector('.story-toc')
      return (
        target.getBoundingClientRect().top >=
        nav.getBoundingClientRect().bottom - 1
      )
    })
    await inspect(`large text story destination ${width}x${height}`)
  }

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(base)
  await page.getByRole('button', { name: 'Menu', exact: true }).tap()
  await page.setViewportSize({ width: 844, height: 390 })
  await page.locator('.nav-links a[href="/#connect"]').tap()
  await page.waitForURL('**/#connect')
  await page.locator('#contact-email').fill('mobile@example.com')
  await page.setViewportSize({ width: 390, height: 320 })
  await page.locator('#contact-message').fill('Local keyboard layout check')
  await inspect('contact with reduced screen height')
  assert.ok(
    await page
      .locator('#contact-message')
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize) >= 16),
    'Inputs avoid automatic focus zoom'
  )
  await page
    .getByRole('button', { name: 'Send message', exact: true })
    .scrollIntoViewIfNeeded()
  const formButton = await page
    .getByRole('button', { name: 'Send message', exact: true })
    .boundingBox()
  assert.ok(
    formButton.y >= 0 && formButton.y + formButton.height <= 321,
    'Submit remains reachable with reduced viewport'
  )
  checks.push(
    'rotate with menu open; contact inputs and submit in short viewport'
  )

  for (const [width, height, scale] of [
    [320, 568, 200],
    [568, 320, 100],
  ]) {
    await page.setViewportSize({ width, height })
    await page.goto(base + '/rpsls')
    await page.evaluate(
      (scale) => (document.documentElement.style.fontSize = scale + '%'),
      scale
    )
    await page.getByRole('button', { name: 'scissors', exact: true }).tap()
    await page
      .getByRole('button', { name: 'Play another round', exact: true })
      .waitFor()
    await inspect(`duel result ${width} text ${scale}%`)
    await page
      .getByRole('button', { name: 'Play another round', exact: true })
      .tap()
    assert.equal(await page.locator('.duel-choice:disabled').count(), 0)
    await page.goto(base + '/escape')
    await page.evaluate(
      (scale) => (document.documentElement.style.fontSize = scale + '%'),
      scale
    )
    await page.locator('canvas').tap()
    await page.locator('.escape-result').waitFor({ timeout: 20000 })
    await inspect(`runner result ${width} text ${scale}%`)
    await page.screenshot({
      path: `${output}/${engine}-runner-${width}.png`,
      scale: 'css',
    })
    await page.getByRole('button', { name: 'Play again', exact: true }).tap()
    await page.locator('.escape-result').waitFor({ state: 'hidden' })
  }
  await writeFile(
    `${output}/${engine}-report.json`,
    JSON.stringify({ checks, failures }, null, 2)
  )
  console.log(
    JSON.stringify({ engine, checks: checks.length, failures }, null, 2)
  )
} finally {
  await browser.close()
}
if (failures.length) process.exitCode = 1
