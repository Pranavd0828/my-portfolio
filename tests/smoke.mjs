import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { caseStudies } from '../src/content/caseStudies.ts'
const base = process.env.PORTFOLIO_TEST_URL ?? 'http://127.0.0.1:3020'
assert.match(
  base,
  /^http:\/\/(127\.0\.0\.1|localhost):\d+$/,
  'Smoke tests only target a local server.'
)
const routes = [
  '/',
  '/work',
  '/reading',
  '/playground',
  '/escape',
  '/rpsls',
  ...caseStudies.map((s) => `/work/${s.slug}`),
]
const assets = new Set(['/Pranav-Deo-Resume.pdf', '/favicon.jpg'])
const pageHtml = new Map()
const anchors = []
const bundles = new Set()
for (const route of routes) {
  const response = await fetch(base + route)
  assert.equal(response.status, 200, route)
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
  assert.equal(response.headers.get('x-frame-options'), 'DENY')
  const html = await response.text()
  pageHtml.set(route, html)
  for (const match of html.matchAll(
    /(?:href|src)="(\/_next\/static\/[^" ]+\.(?:css|js))"/g
  ))
    bundles.add(match[1])
  for (const match of html.matchAll(/href="([^" ]*#[^" ]+)"/g)) {
    const url = new URL(match[1], base + route)
    if (url.origin === base) anchors.push(url)
  }
  assert.match(html, /property="og:image" content="https:\/\/www\.pranavdeo\.info\/social-preview\.png"/, `${route}: social preview`)
  assert.match(html, /<h1[ >]/, `${route}: h1`)
  assert.match(html, /Skip to content/, `${route}: skip link`)
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1]
  assert.ok(title, `${route}: title`)
  assert.equal(
    (title.match(/Pranav Deo/g) || []).length,
    1,
    `${route}: duplicated title`
  )
  assert.ok(
    html.includes(
      `rel="canonical" href="https://www.pranavdeo.info${route === '/' ? '' : route}`
    ),
    `${route}: canonical`
  )
  assert.ok(!html.includes('LOADING ['), `${route}: no loading gate`)
  for (const match of html.matchAll(/(?:href|src)="(\/[^"?]*)"/g)) {
    const path = match[1].split('#')[0]
    if (path && !path.startsWith('//') && !path.startsWith('/_next'))
      assets.add(path)
  }
  if (route === '/') {
    for (const id of ['contact-name', 'contact-email', 'contact-message'])
      assert.ok(html.includes(`for="${id}"`), `${id}: label`)
    assert.match(html, /aria-live="polite"/)
    assert.match(html, /June 2026 to present/, 'Confirmed Staff promotion')
    assert.match(html, /May 2021 to present/, 'Confirmed Rakuten tenure')
    assert.match(html, /July 2022 to June 2026/, 'Confirmed Senior PM period')
    assert.match(html, /May 2021 to July 2022/, 'Confirmed initial PM period')
    assert.doesNotMatch(html, /Jun(?:e)? 2025/, 'No obsolete promotion date')
  }
  if (route === '/work/whatsapp-catch-up')
    assert.ok(
      html.indexOf('Explore prototype') < html.indexOf('Technical context'),
      'demo precedes stack'
    )
  console.log(`PASS ${route}`)
}
for (const url of anchors) {
  const html = pageHtml.get(url.pathname)
  assert.ok(html, `anchor page: ${url.pathname}`)
  assert.ok(
    html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
    `anchor: ${url.pathname}${url.hash}`
  )
}
const homepage = pageHtml.get('/')
for (const story of caseStudies) {
  assert.ok(
    homepage.includes(`href="/work/${story.slug}"`),
    `homepage exposes ${story.slug}`
  )
  if (story.status === 'Professional work') {
    const html = pageHtml.get(`/work/${story.slug}`)
    assert.doesNotMatch(html, /Jun(?:e)? 2025/, 'No obsolete professional timeline')
    assert.ok(story.timeframeLabel, 'Career context is distinguished from project dates')
    for (const field of [
      'decision',
      'systemMap',
      'leadership',
      'productArtifacts',
    ])
      assert.ok(story[field], `${story.slug}: ${field}`)
    for (const id of ['decision', 'system', 'leadership', 'artifacts'])
      assert.ok(html.includes(`id="${id}"`), `${story.slug}: ${id} section`)
    assert.ok(
      html.includes(story.decision.question),
      `${story.slug}: decision question`
    )
    assert.ok(
      html.includes('Sanitized reconstruction'),
      `${story.slug}: evidence boundary`
    )
  }
}
for (const path of assets) {
  const response = await fetch(base + path)
  assert.equal(response.status, 200, path)
}
for (const path of bundles) {
  const response = await fetch(base + path)
  assert.equal(response.status, 200, `build asset: ${path}`)
  assert.match(
    response.headers.get('content-type') || '',
    path.endsWith('.css') ? /text\/css/ : /javascript/,
    `asset type: ${path}`
  )
  assert.ok((await response.text()).length > 0, `nonempty asset: ${path}`)
}
console.log(`PASS ${bundles.size} production CSS and JavaScript bundles.`)
const pdf = Buffer.from(
  await (await fetch(base + '/Pranav-Deo-Resume.pdf')).arrayBuffer()
)
assert.equal(pdf.subarray(0, 5).toString(), '%PDF-')
assert.deepEqual(pdf, await readFile('public/Pranav-Deo-Resume.pdf'))
const robots = await fetch(base + '/robots.txt')
assert.equal(robots.status, 200)
assert.match(
  await robots.text(),
  /Sitemap: https:\/\/www.pranavdeo.info\/sitemap.xml/
)
const sitemap = await fetch(base + '/sitemap.xml')
assert.equal(sitemap.status, 200)
const xml = await sitemap.text()
for (const route of routes)
  assert.ok(
    xml.includes('https://www.pranavdeo.info' + (route === '/' ? '' : route)),
    `sitemap: ${route}`
  )
for (const route of ['/missing-portfolio-page', '/work/missing-case-study']) {
  const response = await fetch(base + route)
  assert.equal(response.status, 404, route)
  assert.match(await response.text(), /back to the work/)
}
console.log(
  `PASS ${routes.length} pages, ${assets.size} linked routes/assets, résumé bytes, metadata, robots, sitemap, and 404s. No contact message was sent.`
)
