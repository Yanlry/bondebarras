import { expect, test } from '@playwright/test'
import { horizontalOverflow, opacityOf, pixelDifference, scrollRoom, shotPath, waitForSite } from './helpers.ts'

/** Moments de la timeline photographiés (fraction de la traversée de la scène). */
const MOMENTS = [
  { at: 0.08, name: '02-cadrage' },
  { at: 0.25, name: '03-debarras-maison' },
  { at: 0.42, name: '04-debarras-entreprise' },
  { at: 0.77, name: '05-situations' },
  { at: 0.88, name: '06-lumiere' },
  { at: 1, name: '07-place-nette' },
] as const

// Non-régression de l'accueil (écran de chargement, hero 3D, scène « Place nette »).
test.describe('Accueil — chargement et pièce 3D', () => {
  test('écran de chargement : site inerte derrière, puis levée', async ({ page }, info) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('.splash')
    await page.waitForTimeout(500)
    await page.screenshot({ path: shotPath(info, '00-chargement') })
    expect(await page.evaluate(() => document.querySelector('main')?.inert)).toBe(true)
    await waitForSite(page, 0)
    expect(await page.evaluate(() => document.querySelector('main')?.inert)).toBe(false)
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
  })

  test('hero : message, devis et téléphone immédiatement accessibles', async ({ page }, info) => {
    await page.goto('/')
    await waitForSite(page)
    await page.screenshot({ path: shotPath(info, '01-hero') })

    await expect(page.locator('h1')).toContainText('Bon Débarras')
    await expect(page.locator('h1')).toContainText('Débarras de maisons')
    // Devis gratuit visible dans le premier écran (en-tête + hero), téléphone cliquable
    const quote = page.locator('header a.action[href="/devis"]')
    await expect(quote).toBeInViewport()
    await expect(page.locator('[data-hero-copy] a[href="/devis"]')).toBeInViewport()
    await expect(page.locator('header a[href="tel:+33662832657"]')).toBeVisible()
    expect(await horizontalOverflow(page)).toBe(0)
  })

  test('scène scrubbée : la pièce se vide, puis « Bon débarras. »', async ({ page }, info) => {
    await page.goto('/')
    await waitForSite(page)
    for (const moment of MOMENTS) {
      await scrollRoom(page, moment.at)
      await page.screenshot({ path: shotPath(info, moment.name) })
      expect(await horizontalOverflow(page)).toBe(0)
    }
    expect(await opacityOf(page, '#place-nette-title')).toBe(1)
    expect(await opacityOf(page, '[data-hero-copy]')).toBe(0)
  })

  test('scroll arrière : la scène se rejoue à l’envers', async ({ page }, info) => {
    await page.goto('/')
    await waitForSite(page)
    // La caméra « respire » sur écran tactile : on compare la position de la souris immobile (desktop).
    await page.mouse.move(5, 5)
    await scrollRoom(page, 0.5, 1800)
    const forward = await page.screenshot()
    await scrollRoom(page, 1, 1800)
    await scrollRoom(page, 0.5, 1800)
    const backward = await page.screenshot({ path: shotPath(info, '08-retour-50') })

    const difference = await pixelDifference(page, forward, backward)
    info.annotations.push({ type: 'différence aller / retour', description: `${(difference * 100).toFixed(2)} % des pixels` })
    console.log(`[${info.project.name}] écart aller / retour à 50 % : ${(difference * 100).toFixed(2)} % des pixels`)
    if (!info.project.use.isMobile) expect(difference).toBeLessThan(0.01)

    await scrollRoom(page, 0, 1800)
    expect(await opacityOf(page, '[data-hero-copy]')).toBe(1)
    expect(await opacityOf(page, '#place-nette-title')).toBe(0)
    await page.screenshot({ path: shotPath(info, '09-retour-hero') })
  })

  test('mouvement réduit : aucun épinglage, états finaux lisibles', async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await waitForSite(page, 600)
    await page.screenshot({ path: shotPath(info, '10-statique-hero') })
    // Aucun épinglage : la scène n'est pas en `position: sticky`
    const position = await page.evaluate(() => {
      const stage = [...(document.querySelector('#accueil')?.children ?? [])].find((element) => element.tagName === 'DIV')
      return stage ? getComputedStyle(stage).position : 'absente'
    })
    expect(position).toBe('relative')
    const cleared = page.locator('#place-nette-title')
    await cleared.scrollIntoViewIfNeeded()
    await expect(cleared).toBeVisible()
    await expect(page.locator('img[src*="piece-apres"]')).toBeVisible()
    await page.waitForTimeout(400)
    await page.screenshot({ path: shotPath(info, '11-statique-fin') })
    expect(await horizontalOverflow(page)).toBe(0)
  })

  test('clavier : liens d’évitement vers le contenu et le devis', async ({ page }, info) => {
    test.skip(Boolean(info.project.use.isMobile), 'Navigation clavier testée sur desktop')
    await page.goto('/')
    await waitForSite(page, 300)
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toHaveText('Aller au contenu')
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toHaveText('Demander un devis')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/devis$/)
    await expect(page.locator('h1')).toHaveText('Demander un devis gratuit')
  })
})
