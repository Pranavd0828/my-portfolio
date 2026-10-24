import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const port = Number(process.env.PORTFOLIO_PREVIEW_PORT || 3040)
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  throw new Error('Choose a localhost port between 1024 and 65535.')
}
const url = `http://127.0.0.1:${port}`
const probe = createServer()
await new Promise((resolve, reject) => {
  probe.once('error', reject)
  probe.listen(port, '127.0.0.1', () => probe.close(resolve))
})

// A new build never overwrites the assets used by an existing preview.
const distDir = `.next-preview-${Date.now()}`
const env = { ...process.env, PORTFOLIO_DIST_DIR: distDir }
const next = join(root, 'node_modules/next/dist/bin/next')
let child
let stopping = false
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    stopping = true
    child?.kill(signal)
  })
}

async function build() {
  return new Promise((resolve, reject) => {
    child = spawn(process.execPath, [next, 'build', '--webpack'], {
      cwd: root,
      env,
      stdio: 'inherit',
    })
    child.once('error', reject)
    child.once('exit', (code) => {
      if (code === 0 && !stopping) resolve()
      else reject(new Error(`Preview build did not complete successfully (${code}).`))
    })
  })
}

await build()
child = spawn(process.execPath, [next, 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
  cwd: root,
  env,
  stdio: 'inherit',
})
let serverError
child.once('error', (error) => { serverError = error })
const exited = new Promise((resolve) => child.once('exit', resolve))

try {
  let html
  for (let attempt = 0; attempt < 60; attempt++) {
    if (serverError) throw serverError
    if (stopping || child.exitCode !== null || child.signalCode !== null) {
      throw new Error('Preview server stopped before it was ready.')
    }
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2000) })
      if (response.ok) {
        html = await response.text()
        break
      }
    } catch {
      // The first request can precede the listening socket.
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  if (!html) throw new Error('Preview readiness check timed out.')
  const assets = [...new Set([...html.matchAll(/(?:href|src)="(\/_next\/static\/[^" ]+\.(?:css|js))"/g)].map((m) => m[1]))]
  if (!assets.some((asset) => asset.endsWith('.css'))) {
    throw new Error('The preview document has no stylesheet reference.')
  }
  for (const asset of assets) {
    const response = await fetch(url + asset, { signal: AbortSignal.timeout(10000) })
    const expected = asset.endsWith('.css') ? /text\/css/ : /javascript/
    if (!response.ok || !expected.test(response.headers.get('content-type') || '') || !(await response.text()).length) {
      throw new Error(`Preview asset validation failed: ${asset}`)
    }
  }
  await mkdir(join(root, '.local-preview'), { recursive: true })
  await writeFile(join(root, '.local-preview/current.json'), JSON.stringify({
    url, distDir, pid: child.pid, startedAt: new Date().toISOString(), verifiedAssets: assets.length,
  }, null, 2))
  console.log(`\nPreview ready: ${url}\nVerified ${assets.length} CSS and JavaScript assets. Browser review remains required.\n`)
} catch (error) {
  child.kill('SIGTERM')
  await exited
  throw error
}

const code = await exited
process.exitCode = stopping ? 0 : (code ?? 1)
