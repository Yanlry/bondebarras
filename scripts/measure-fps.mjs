/**
 * Mesure réelle des FPS sur le build de production (`npm run build` d'abord).
 *
 * Pour chaque profil : chargement, fin de l'intro, 3 s de hero (souris en
 * mouvement sur desktop), puis traversée complète de la scène de la pièce en
 * 8 s. Relevés : FPS moyen, frames > 20 ms et > 33 ms, et Long Animation
 * Frames (> 50 ms) via PerformanceObserver.
 *
 * Chromium sur le GPU réel (Metal). Mobile : 390 × 844, DPR 2, CPU ralenti ×4
 * (le GPU, lui, n'est pas ralenti : à confirmer sur un vrai téléphone).
 *
 * Artefact connu : dans Chromium piloté par Playwright, le **premier**
 * défilement qui suit un mouvement de souris produit une frame de 70 à 120 ms,
 * reproduite à l'identique sur une page vide (voir README). Sur desktop, un cran
 * de molette est donc donné avant la traversée, puis la page revient en haut.
 *
 * Usage : npm run measure:fps
 */
import { chromium, devices } from 'playwright'
import { preview } from 'vite'

const PROFILES = [
  { name: 'desktop 1440 × 900', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, cpu: 1, mobile: false },
  { name: 'mobile 390 × 844, CPU ×4', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, cpu: 4, mobile: true },
]

const server = await preview({ preview: { port: 4174, strictPort: true }, logLevel: 'error' })
const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const results = []

/** Enregistre les frames pendant `run` (exécuté dans la page). */
const measure = (page, label, run) =>
  page.evaluate(
    async ([label, run]) => {
      const intervals = []
      let long = 0
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) if (entry.duration > 50) long++
      })
      try {
        observer.observe({ type: 'long-animation-frame', buffered: false })
      } catch {}
      let last = performance.now()
      let running = true
      const tick = (now) => {
        intervals.push(now - last)
        last = now
        if (running) requestAnimationFrame(tick)
      }
      requestAnimationFrame((now) => {
        last = now
        requestAnimationFrame(tick)
      })
      await new Function(`return (${run})()`)()
      running = false
      observer.disconnect()
      const total = intervals.reduce((a, b) => a + b, 0)
      return {
        label,
        frames: intervals.length,
        fps: Math.round((intervals.length / total) * 1000 * 10) / 10,
        over20: intervals.filter((d) => d > 20).length,
        over33: intervals.filter((d) => d > 33.4).length,
        worst: Math.round(Math.max(...intervals) * 10) / 10,
        longAnimationFrames: long,
      }
    },
    [label, run.toString()],
  )

try {
  for (const profile of PROFILES) {
    const context = await browser.newContext({
      viewport: profile.viewport,
      deviceScaleFactor: profile.deviceScaleFactor,
      isMobile: profile.mobile,
      hasTouch: profile.mobile,
      userAgent: profile.mobile ? devices['Pixel 7'].userAgent : undefined,
    })
    const page = await context.newPage()
    const cdp = await context.newCDPSession(page)
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: profile.cpu })
    await page.goto('http://localhost:4174/')
    await page.waitForFunction(() => !document.querySelector('.splash'), null, { timeout: 30000 })
    await page.waitForTimeout(3000)

    if (!profile.mobile) {
      // Souris qui balaie la pièce pendant la mesure du hero
      void (async () => {
        for (let i = 0; i <= 60; i++) await page.mouse.move(700 + Math.sin(i / 6) * 450, 450 + Math.cos(i / 5) * 200)
      })()
    }
    const hero = await measure(page, 'hero (3 s)', () => new Promise((resolve) => setTimeout(resolve, 3000)))
    if (!profile.mobile) {
      await page.mouse.wheel(0, 40)
      await page.waitForTimeout(300)
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(1500)
    }
    const scroll = await measure(
      page,
      'traversée de la scène (8 s)',
      () =>
        new Promise((resolve) => {
          const section = document.querySelector('#accueil')
          const end = section.offsetTop + section.offsetHeight - window.innerHeight
          const start = performance.now()
          const step = (now) => {
            const t = Math.min(1, (now - start) / 8000)
            window.scrollTo(0, end * t)
            if (t < 1) requestAnimationFrame(step)
            else setTimeout(resolve, 600)
          }
          requestAnimationFrame(step)
        }),
    )
    const renderer = await page.evaluate(() => {
      const gl = document.createElement('canvas').getContext('webgl2')
      return gl?.getParameter(gl.getExtension('WEBGL_debug_renderer_info')?.UNMASKED_RENDERER_WEBGL ?? 0)
    })
    results.push({ profile: profile.name, renderer, measures: [hero, scroll] })
    await context.close()
  }
} finally {
  await browser.close()
  await server.close()
}

for (const result of results) {
  console.log(`\n${result.profile} — ${result.renderer}`)
  console.table(result.measures)
}
console.log(JSON.stringify(results))
