import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { once } from 'node:events'
import test from 'node:test'

async function startServer(birthdate = '') {
  const child = spawn(process.execPath, ['server/index.js'], {
    env: { ...process.env, PORT: '0', PROFILE_BIRTHDATE: birthdate },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let output = ''
  child.stderr.on('data', (data) => {
    output += data
  })
  try {
    const port = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Server startup timeout: ${output}`)), 10_000)
      child.once('error', (error) => {
        clearTimeout(timer)
        reject(error)
      })
      child.once('exit', (code) => {
        clearTimeout(timer)
        reject(new Error(`Server exited ${code}: ${output}`))
      })
      child.stdout.on('data', (data) => {
        const match = String(data).match(/Server listening on port (\d+)/)
        if (match) {
          clearTimeout(timer)
          resolve(match[1])
        }
      })
    })
    return { child, url: `http://127.0.0.1:${port}` }
  } catch (error) {
    child.kill()
    throw error
  }
}

async function stopServer(child) {
  const stopped = once(child, 'exit')
  child.kill()
  await stopped
}

test('production routes, assets and profile survive the cleanup; the chat API is removed', async () => {
  const { child, url } = await startServer()
  try {
    const index = await readFile('dist/index.html', 'utf8')
    for (const path of ['/', '/work', '/projets', '/cv', '/mentions-legales', '/confidentialite']) {
      const response = await fetch(url + path)
      assert.equal(response.status, 200, path)
      assert.equal(await response.text(), index, path)
    }
    for (const match of index.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)) {
      const response = await fetch(url + match[1])
      assert.equal(response.status, 200, match[1])
      assert.notEqual(response.headers.get('content-type'), 'text/html; charset=UTF-8')
    }
    assert.deepEqual(await (await fetch(url + '/api/profile')).json(), { currentAge: null })
    const pdf = await fetch(url + '/cv.pdf')
    assert.equal(pdf.status, 200)
    assert.match(pdf.headers.get('content-type'), /application\/pdf/)
    const chat = await fetch(url + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Bonjour' }),
    })
    assert.equal(chat.status, 404)
  } finally {
    await stopServer(child)
  }
})

test('favicons and installed-app icons are served as images with the declared dimensions', async () => {
  const { child, url } = await startServer()
  try {
    const index = await readFile('dist/index.html', 'utf8')
    assert.match(index, /rel="manifest" href="\/site\.webmanifest"/)
    const manifestResponse = await fetch(url + '/site.webmanifest')
    assert.match(manifestResponse.headers.get('content-type'), /json|manifest/)
    const manifest = await manifestResponse.json()
    assert.equal(manifest.start_url, '/')
    assert.equal(manifest.display, 'standalone')
    assert.ok(manifest.icons.some(icon => icon.sizes === '1024x1024' && icon.purpose === 'any'))
    assert.ok(manifest.icons.some(icon => icon.purpose === 'maskable'))
    const pngs = [
      ...manifest.icons.map(icon => [icon.src, Number(icon.sizes.split('x')[0])]),
      ['/icons/apple-touch-180-v2.png', 180],
      ...[16, 32, 48].map(size => [`/icons/favicon-${size}-v2.png`, size]),
    ]
    for (const [src, size] of pngs) {
      const response = await fetch(url + src)
      assert.equal(response.status, 200, src)
      assert.match(response.headers.get('content-type'), /image\/png/, src)
      const bytes = Buffer.from(await response.arrayBuffer())
      assert.equal(bytes.subarray(1, 4).toString(), 'PNG', src)
      assert.equal(bytes.readUInt32BE(16), size, src)
      assert.equal(bytes.readUInt32BE(20), size, src)
    }
    const svg = await fetch(url + '/favicon.svg?v=2')
    assert.match(svg.headers.get('content-type'), /image\/svg\+xml/)
    const ico = await fetch(url + '/favicon.ico?v=2')
    assert.match(ico.headers.get('content-type'), /image\//)
    const directory = Buffer.from(await ico.arrayBuffer())
    assert.equal(directory.readUInt16LE(2), 1)
    assert.equal(directory.readUInt16LE(4), 3)
    assert.deepEqual([6, 22, 38].map(offset => directory[offset]), [16, 32, 48])
  } finally {
    await stopServer(child)
  }
})

test('profile age still comes from the server configuration', async () => {
  const now = new Date()
  const birthYear = now.getFullYear() - 25
  const { child, url } = await startServer(`${birthYear}-12-31`)
  try {
    const expectedAge = now.getMonth() === 11 && now.getDate() === 31 ? 25 : 24
    const response = await fetch(url + '/api/profile')
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { currentAge: expectedAge })
  } finally {
    await stopServer(child)
  }
})
