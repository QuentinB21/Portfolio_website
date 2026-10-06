// Run with playwright-cli run-code --filename scripts/render-icons.js from the repo.
// A local Vite server must be running at http://127.0.0.1:5173.
async (page) => {
  await page.goto('http://127.0.0.1:5173/')
  const response = await page.request.get('http://127.0.0.1:5173/favicon.svg')
  if (!response.ok()) throw new Error('Unable to load the source favicon')
  const source = await response.text()
  const sourceUrl = `data:image/svg+xml;base64,${Buffer.from(source).toString('base64')}`
  const exports = [
    ...[16, 32, 48].map(size => ({ size, name: `favicon-${size}-v2`, inset: 0, background: false })),
    { size: 180, name: 'apple-touch-180-v2', inset: .09, background: true },
    ...[192, 512, 1024].map(size => ({ size, name: `app-${size}-v2`, inset: .09, background: true })),
    // The full mark fits inside the central 80%-diameter safe circle.
    ...[512, 1024].map(size => ({ size, name: `app-maskable-${size}-v2`, inset: .18, background: true })),
  ]
  for (const { size, name, inset, background } of exports) {
    await page.setViewportSize({ width: size, height: size })
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
      ${background ? '<rect width="512" height="512" fill="#f2f5f8"/>' : ''}
      <image href="${sourceUrl}" x="${512 * inset}" y="${512 * inset}" width="${512 * (1 - 2 * inset)}" height="${512 * (1 - 2 * inset)}"/>
    </svg>`
    await page.setContent(`<html><body style="margin:0"><img width="${size}" height="${size}" style="display:block" src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"/></body></html>`)
    await page.locator('img').evaluate(img => img.decode())
    await page.screenshot({ path: `public/icons/${name}.png`, omitBackground: true })
  }
  return { exported: exports.length }
}
