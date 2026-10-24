import { expect, test } from '@playwright/test'
import { collectErrors, opacityOf, scrollRoom, shotPath, waitForSite } from './helpers.ts'

/** Les six situations, dans l'ordre, avec la page de prestation attendue. */
const SITUATIONS = [
  { short: 'Maison à vider', href: '/prestations/debarras-particuliers' },
  { short: 'Cave, grenier, garage', href: '/prestations/debarras-cave-grenier-garage' },
  { short: 'Succession, EHPAD', href: '/prestations/debarras-succession' },
  { short: 'Logement très encombré', href: '/prestations/syndrome-de-diogene' },
  { short: 'Bureaux, commerces', href: '/prestations/debarras-professionnels' },
  { short: 'Jardin, terrain', href: '/prestations/debarras-exterieur' },
] as const

/** Rectangles des étiquettes visibles (pour vérifier qu'elles restent à l'écran et ne se chevauchent pas). */
const visibleTags = (page: import('@playwright/test').Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('[data-situation-tag]')]
      .filter((tag) => getComputedStyle(tag).visibility !== 'hidden' && Number(getComputedStyle(tag).opacity) > 0.9)
      .map((tag) => {
        const rect = tag.querySelector('a')?.getBoundingClientRect()
        return rect ? { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom } : null
      })
      .filter((rect): rect is { left: number; right: number; top: number; bottom: number } => rect !== null),
  )

test.describe('Étape 4 — scène 2 « Vous vous reconnaissez ? »', () => {
  test('étiquettes accrochées aux objets, légende, liens, scroll arrière', async ({ page }, info) => {
    const errors = collectErrors(page)
    await page.goto('/')
    await waitForSite(page)
    const mobile = Boolean(info.project.use.isMobile)

    // Avant la scène : légende et étiquettes masquées
    await scrollRoom(page, 0.04)
    expect(await opacityOf(page, '[data-situations]')).toBe(0)

    // Toutes les étiquettes accrochées (desktop) ou la dernière (mobile, elles se relaient)
    await scrollRoom(page, 0.77)
    expect(await opacityOf(page, '[data-situations]')).toBe(1)
    await page.screenshot({ path: shotPath(info, 'situations', 'scene-2') })
    const tags = await visibleTags(page)
    expect(tags.length).toBe(mobile ? 1 : 6)
    const viewport = page.viewportSize() ?? { width: 0, height: 0 }
    for (const tag of tags) {
      expect(tag.left).toBeGreaterThanOrEqual(0)
      expect(tag.right).toBeLessThanOrEqual(viewport.width)
      expect(tag.top).toBeGreaterThanOrEqual(64)
    }
    // Aucune étiquette n'en chevauche une autre
    for (const [i, a] of tags.entries())
      for (const b of tags.slice(i + 1)) expect(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top).toBe(true)

    // Légende : vrais liens vers chaque prestation, dans l'ordre
    const links = page.locator('[data-situations] a')
    await expect(links).toHaveCount(6)
    for (const [i, situation] of SITUATIONS.entries()) await expect(links.nth(i)).toHaveAttribute('href', situation.href)

    // Une étiquette mène à sa prestation (mobile : la dernière accrochée). Les étiquettes suivent
    // la caméra (qui « respire » sur mobile) : `force` évite d'attendre une immobilité parfaite.
    const target = mobile ? SITUATIONS[5] : SITUATIONS[2]
    await page.locator(`[data-situation-tag] a[href="${target.href}"]`).click({ force: true })
    await expect(page).toHaveURL(new RegExp(`${target.href}$`))
    await expect(page.locator('h1')).toBeVisible()

    // Retour sur l'accueil : la scène se rejoue normalement
    await page.goBack()
    await page.waitForTimeout(1500)
    await scrollRoom(page, 0.92)
    expect(await opacityOf(page, '[data-situations]')).toBe(0)
    await scrollRoom(page, 0.77)
    expect(await opacityOf(page, '[data-situations]')).toBe(1)
    expect(errors).toEqual([])
  })

  // Clics réels (sans `force`) : aucun calque invisible de la scène ne doit intercepter un bouton.
  test('clics réels : hero, légende de la scène 2, bouton final', async ({ page }) => {
    await page.goto('/')
    await waitForSite(page)
    await page.locator('[data-hero-copy] a[href="/devis"]').click()
    await expect(page).toHaveURL(/\/devis$/)

    await page.goto('/')
    await waitForSite(page)
    await scrollRoom(page, 0.77)
    await page.locator('[data-situations] a').first().click()
    await expect(page).toHaveURL(/\/prestations\/debarras-particuliers$/)

    await page.goto('/')
    await waitForSite(page)
    await scrollRoom(page, 1)
    await page.locator('[data-cleared] a[href="/devis"]').click()
    await expect(page).toHaveURL(/\/devis$/)
  })

  test('mobile : les étiquettes se relaient une à une', async ({ page }, info) => {
    test.skip(!info.project.use.isMobile, 'Comportement propre au mobile')
    await page.goto('/')
    await waitForSite(page)
    for (const [i, at] of [0.557, 0.597, 0.636].entries()) {
      await scrollRoom(page, at)
      expect((await visibleTags(page)).length).toBeLessThanOrEqual(1)
      await page.screenshot({ path: shotPath(info, `relais-${i + 1}`, 'scene-2') })
    }
  })

  test('mouvement réduit : les situations en section statique', async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await waitForSite(page, 600)
    const block = page.locator('[data-situations]')
    await block.scrollIntoViewIfNeeded()
    await expect(block.getByRole('heading', { name: 'Vous vous reconnaissez ?' })).toBeVisible()
    await expect(block.getByRole('link')).toHaveCount(6)
    await expect(page.locator('[data-situation-tag]').first()).toBeHidden()
    await page.waitForTimeout(300)
    await page.screenshot({ path: shotPath(info, 'statique', 'scene-2') })
  })
})
