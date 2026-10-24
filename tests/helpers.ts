import type { Page, TestInfo } from '@playwright/test'
import { mkdirSync } from 'node:fs'

/** Étape courante du développement : dossier des captures. */
export const STEP = 'etape-1'
const SHOTS = `docs/screenshots/${STEP}`
mkdirSync(SHOTS, { recursive: true })

/** Chemin d'une capture : `docs/screenshots/etape-1/<projet>-<nom>.png`. */
export const shotPath = (info: TestInfo, name: string): string => `${SHOTS}/${info.project.name}-${name}.png`

/** Attend la fin de l'écran de chargement, puis la fin de l'intro du hero. */
export async function waitForSite(page: Page, introMs = 2600): Promise<void> {
  await page.waitForFunction(() => !document.querySelector('.splash'), null, { timeout: 15_000 })
  await page.waitForTimeout(introMs)
}

/**
 * Fait défiler jusqu'à une fraction de la traversée de la scène de la pièce
 * (0 = hero, 1 = fin de l'épinglage), puis attend la fin du lissage du scrub.
 */
export async function scrollRoom(page: Page, fraction: number, settleMs = 1400): Promise<void> {
  await page.evaluate((f) => {
    const section = document.querySelector<HTMLElement>('#accueil')
    if (!section) throw new Error('#accueil introuvable')
    window.scrollTo(0, section.offsetTop + (section.offsetHeight - window.innerHeight) * f)
  }, fraction)
  await page.waitForTimeout(settleMs)
}

/** Opacité calculée d'un élément (0 si absent ou caché). */
export async function opacityOf(page: Page, selector: string): Promise<number> {
  return page.evaluate((s) => {
    const element = document.querySelector(s)
    if (!element) return 0
    const style = getComputedStyle(element)
    return style.visibility === 'hidden' ? 0 : Number(style.opacity)
  }, selector)
}

/** Largeur de contenu qui dépasse la fenêtre (0 = aucun débordement horizontal). */
export async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
}

/**
 * Part des pixels nettement différents entre deux captures PNG (0 → 1),
 * calculée par le navigateur (aucune dépendance).
 */
export async function pixelDifference(page: Page, a: Buffer, b: Buffer): Promise<number> {
  return page.evaluate(
    async ([first, second]) => {
      const load = async (base64: string) => {
        const image = new Image()
        image.src = `data:image/png;base64,${base64}`
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')
        if (!context) throw new Error('canvas 2D indisponible')
        context.drawImage(image, 0, 0)
        return context.getImageData(0, 0, image.width, image.height).data
      }
      const [pa, pb] = await Promise.all([load(first), load(second)])
      let different = 0
      for (let i = 0; i < pa.length; i += 4) {
        const delta = Math.abs((pa[i] ?? 0) - (pb[i] ?? 0)) + Math.abs((pa[i + 1] ?? 0) - (pb[i + 1] ?? 0)) + Math.abs((pa[i + 2] ?? 0) - (pb[i + 2] ?? 0))
        if (delta > 60) different++
      }
      return different / (pa.length / 4)
    },
    [a.toString('base64'), b.toString('base64')] as const,
  )
}
