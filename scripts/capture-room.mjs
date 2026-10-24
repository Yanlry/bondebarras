/**
 * Génère les images de secours de la pièce (public/images/piece-avant.webp et
 * piece-apres.webp) en photographiant la vraie scène 3D, fond transparent.
 * Lance son propre serveur Vite de développement.
 *
 * Usage : npm run capture:room
 */
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
const server = await createServer({ root, server: { port: 5199, strictPort: true }, logLevel: 'error' })
await server.listen()
const browser = await chromium.launch()

try {
  for (const state of ['avant', 'apres']) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1100 }, deviceScaleFactor: 1 })
    await page.goto(`http://localhost:5199/__capture?etat=${state}`)
    await page.waitForFunction(() => window.__roomCaptureReady === true, null, { timeout: 30000 })
    const png = await page.screenshot({ omitBackground: true, type: 'png' })
    // Conversion PNG → WebP (avec transparence) par le navigateur lui-même
    const webp = await page.evaluate(async (base64) => {
      const image = new Image()
      image.src = `data:image/png;base64,${base64}`
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      canvas.getContext('2d').drawImage(image, 0, 0)
      return canvas.toDataURL('image/webp', 0.84).split(',')[1]
    }, png.toString('base64'))
    const target = new URL(`../public/images/piece-${state}.webp`, import.meta.url)
    await writeFile(target, Buffer.from(webp, 'base64'))
    console.log(`✓ ${fileURLToPath(target)} (${Math.round((webp.length * 0.75) / 1024)} kB)`)
    await page.close()
  }
} finally {
  await browser.close()
  await server.close()
}
