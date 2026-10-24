import { expect, test } from '@playwright/test'
import { collectErrors, horizontalOverflow, shotPath } from './helpers.ts'

/** Toutes les pages pré-rendues (hors accueil), avec leur H1 attendu. */
const PAGES = [
  { path: '/prestations', h1: 'Tous nos débarras, pour chaque espace' },
  { path: '/prestations/debarras-particuliers', h1: 'Débarras de maison et d’appartement' },
  { path: '/prestations/debarras-succession', h1: 'Débarras après décès et succession' },
  { path: '/prestations/debarras-professionnels', h1: 'Débarras de bureaux et de locaux professionnels' },
  { path: '/prestations/debarras-exterieur', h1: 'Débarras de terrain, de jardin et de fin de chantier' },
  { path: '/prestations/tri-recyclage', h1: 'Tri, recyclage et valorisation de vos objets' },
  { path: '/prestations/debarras-cave-grenier-garage', h1: 'Débarras de cave, de grenier et de garage' },
  { path: '/prestations/syndrome-de-diogene', h1: 'Débarras d’un logement très encombré : syndrome de Diogène' },
  { path: '/entreprise', h1: 'Faire de la place, avec méthode' },
  { path: '/devis', h1: 'Demander un devis gratuit' },
  { path: '/contact', h1: 'Nous contacter' },
  { path: '/mentions-legales', h1: 'Mentions légales' },
  { path: '/confidentialite', h1: 'Politique de confidentialité' },
] as const

const PHONE = 'tel:+33662832657'
const shotName = (path: string) => path.slice(1).replace(/\//g, '_')

test.describe('Étape 3 — socle multipage', () => {
  for (const { path, h1 } of PAGES) {
    test(`page ${path} : rendu, console, téléphone, responsive`, async ({ page }, info) => {
      const errors = collectErrors(page)
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveText(h1)
      await expect(page.locator('h1')).toBeVisible()
      await expect(page).toHaveTitle(/Bon Débarras/)
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
      const phones = await page.locator('a[href^="tel:"]').evaluateAll((links) => links.map((link) => link.getAttribute('href')))
      for (const href of phones) expect(href).toBe(PHONE)
      await page.waitForTimeout(500)
      await page.screenshot({ path: shotPath(info, shotName(path), 'pages') })
      await page.screenshot({ path: shotPath(info, `${shotName(path)}-complet`, 'pages'), fullPage: true })
      expect(await horizontalOverflow(page)).toBe(0)
      expect(errors).toEqual([])
    })
  }

  test('sans JavaScript : chaque page affiche son contenu pré-rendu', async ({ browser }, info) => {
    test.skip(info.project.name !== 'desktop-1440', 'Contrôle du HTML : une seule taille suffit')
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } })
    const page = await context.newPage()
    for (const { path, h1 } of [{ path: '/', h1: 'Bon Débarras' }, ...PAGES]) {
      await page.goto(path)
      await expect(page.locator('h1')).toContainText(h1)
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.getByRole('banner')).toBeVisible()
      await expect(page.locator('footer')).toContainText('06 62 83 26 57')
      expect((await page.locator('main').innerText()).length).toBeGreaterThan(200)
    }
    // Accueil : pas d'écran de chargement bloquant, textes du hero visibles
    await page.goto('/')
    await expect(page.locator('.splash')).toBeHidden()
    await expect(page.locator('[data-hero-copy] a[href="/devis"]')).toBeVisible()
    await page.screenshot({ path: shotPath(info, 'sans-js-accueil', 'pages') })
    await context.close()
  })

  test('menu Prestations (desktop) : survol, clavier, Échap, navigation', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop-1440', 'Menu desktop')
    const errors = collectErrors(page)
    await page.goto('/entreprise')
    const toggle = page.getByRole('button', { name: 'Prestations' })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await toggle.hover()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const panel = page.locator('.nav-panel')
    await expect(panel.getByRole('link', { name: /Syndrome de Diogène/ })).toBeVisible()
    await page.waitForTimeout(400)
    await page.screenshot({ path: shotPath(info, 'menu-prestations', 'pages') })

    // Clavier : Échap ferme et rend le focus au bouton, Entrée rouvre, Tab entre dans le panneau
    await toggle.focus()
    await page.keyboard.press('Escape')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(toggle).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toContainText('Particuliers')

    // Navigation avec transition « scotch », focus sur le H1 de la nouvelle page
    await panel.getByRole('link', { name: /Syndrome de Diogène/ }).click()
    await expect(page).toHaveURL(/\/prestations\/syndrome-de-diogene$/)
    await expect(page.locator('h1')).toBeFocused()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('.page-tape')).toBeHidden()
    await expect(page).toHaveTitle('Débarras syndrome de Diogène · Bon Débarras')
    expect(errors).toEqual([])
  })

  test('menu mobile : ouverture, focus piégé, Échap, navigation', async ({ page }, info) => {
    test.skip(!info.project.use.isMobile, 'Menu mobile')
    const errors = collectErrors(page)
    await page.goto('/contact')
    const open = page.getByRole('button', { name: 'Menu' })
    await open.click()
    const dialog = page.getByRole('dialog', { name: 'Menu' })
    await expect(dialog).toBeVisible()
    await page.waitForTimeout(650)
    await page.screenshot({ path: shotPath(info, 'menu-mobile', 'pages') })
    await expect(dialog.locator(':focus')).toHaveCount(1)
    for (let i = 0; i < 12; i++) await page.keyboard.press('Tab')
    await expect(dialog.locator(':focus')).toHaveCount(1)
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(open).toBeFocused()

    await open.click()
    await dialog.getByRole('button', { name: 'Prestations' }).click()
    await page.waitForTimeout(650)
    await page.screenshot({ path: shotPath(info, 'menu-mobile-prestations', 'pages') })
    await dialog.getByRole('link', { name: 'Professionnels' }).click()
    await expect(page).toHaveURL(/\/prestations\/debarras-professionnels$/)
    await expect(dialog).toBeHidden()
    await expect(page.locator('h1')).toHaveText('Débarras de bureaux et de locaux professionnels')
    expect(errors).toEqual([])
  })

  test('devis présélectionné depuis une prestation', async ({ page }, info) => {
    const errors = collectErrors(page)
    await page.goto('/prestations/debarras-succession')
    await page.locator('main a[href="/devis?type=succession"]').first().click()
    await expect(page).toHaveURL(/\/devis\?type=succession$/)
    await expect(page.getByRole('radio', { name: 'Succession, après décès' })).toBeChecked()
    await page.goto('/devis?type=bureaux')
    await expect(page.getByRole('radio', { name: 'Bureaux, commerce' })).toBeChecked()
    await page.goto('/devis?type=inconnu')
    await page.waitForTimeout(300)
    await expect(page.locator('input[name="type"]:checked')).toHaveCount(0)
    await page.goto('/devis?type=succession')
    await page.locator('#devis-formulaire').scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    await page.screenshot({ path: shotPath(info, 'devis-formulaire', 'pages') })
    expect(errors).toEqual([])
  })

  test('formulaire : aucun faux succès sans système d’envoi', async ({ page }) => {
    await page.goto('/devis')
    await expect(page.getByRole('note').filter({ hasText: 'Formulaire en cours de finalisation' })).toBeVisible()
    const form = page.locator('#devis-formulaire form')
    await form.getByLabel('Nom').fill('Test')
    await form.getByLabel('Téléphone').fill('0600000000')
    await form.getByRole('radio', { name: 'Autre besoin' }).check({ force: true })
    await form.getByLabel('Code postal').fill('75001')
    await form.getByLabel('Ville').fill('Paris')
    await form.getByLabel('Votre besoin').fill('Test de non-régression')
    await form.getByRole('checkbox').check()
    await form.getByRole('button', { name: 'Envoyer ma demande de devis' }).click()
    await expect(page.getByRole('status').filter({ hasText: 'L’envoi en ligne n’est pas encore activé' })).toBeVisible()
  })

  test('page 404 : vrai code 404 et chemins utiles', async ({ page }, info) => {
    const response = await page.goto('/cette-page-n-existe-pas')
    expect(response?.status()).toBe(404)
    await expect(page.locator('h1')).toHaveText('Cette page a déjà été débarrassée')
    await expect(page.locator('main a[href="/devis"]')).toBeVisible()
    await page.screenshot({ path: shotPath(info, '404', 'pages') })
  })

  test('liens d’évitement (desktop) et barre d’actions (mobile)', async ({ page }, info) => {
    if (!info.project.use.isMobile) {
      await page.goto('/devis')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await expect(page.locator(':focus')).toHaveText('Aller au formulaire')
      return
    }
    await page.goto('/prestations')
    const bar = page.locator('div.fixed.bottom-0')
    await expect(bar).toHaveAttribute('inert', '')
    await page.evaluate(() => window.scrollTo(0, window.innerHeight))
    await expect(bar).not.toHaveAttribute('inert', '')
    await expect(bar.getByRole('link', { name: 'Appeler' })).toHaveAttribute('href', PHONE)
    await page.waitForTimeout(400)
    await page.screenshot({ path: shotPath(info, 'barre-mobile', 'pages') })
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(bar).toHaveAttribute('inert', '')
  })

  test('sitemap et robots : site en préparation, rien d’indexable', async ({ request }) => {
    const robots = await (await request.get('/robots.txt')).text()
    expect(robots).toContain('Disallow: /')
    const sitemap = await (await request.get('/sitemap.xml')).text()
    expect(sitemap).toContain('<urlset')
    expect(sitemap).not.toContain('<loc>')
  })
})
