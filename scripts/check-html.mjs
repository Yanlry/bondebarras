/**
 * Contrôle du HTML pré-rendu (dist/client), exécuté après chaque build :
 * le référencement ne doit jamais dépendre du JavaScript ni des animations.
 *
 * Pour chaque page : un seul H1, un <title> (≤ 60 caractères) et une meta
 * description (≤ 155) uniques, une balise robots cohérente avec le statut du
 * site, une canonical (sauf 404), du texte réel dans <main>. Pour tout le site :
 * chaque lien interne mène à une page ou un fichier généré, chaque lien
 * téléphone utilise le numéro officiel, aucun ancien numéro provisoire.
 *
 * Usage : node scripts/check-html.mjs (échoue avec la liste des problèmes).
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../dist/client/', import.meta.url))
const PHONE = 'tel:+33662832657'
const problems = []
const seen = { titles: new Map(), descriptions: new Map() }

/** Toutes les pages HTML pré-rendues (hors repli SPA et copie 404.html). */
function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return name === 'assets' ? [] : htmlFiles(path)
    return name === 'index.html' ? [path] : []
  })
}

const decode = (text) =>
  text
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;| /g, ' ')

const attr = (html, pattern) => {
  const match = html.match(pattern)
  return match ? decode(match[1]) : null
}

/** Un lien interne mène-t-il à un fichier généré ? */
function resolves(href) {
  const path = href.split(/[?#]/)[0]
  if (path === '/') return existsSync(join(root, 'index.html'))
  const target = join(root, path)
  return existsSync(join(target, 'index.html')) || (existsSync(target) && statSync(target).isFile())
}

const files = htmlFiles(root)
for (const file of files) {
  const page = '/' + relative(root, file).replace(/index\.html$/, '').replace(/\/$/, '')
  const html = readFileSync(file, 'utf8')
  const fail = (message) => problems.push(`${page} : ${message}`)

  const h1 = html.match(/<h1[\s>]/g) ?? []
  if (h1.length !== 1) fail(`${h1.length} H1 (1 attendu)`)

  const title = attr(html, /<title>([^<]*)<\/title>/)
  if (!title) fail('pas de <title>')
  else {
    if (title.length > 60) fail(`titre trop long (${title.length} > 60) : ${title}`)
    if (seen.titles.has(title)) fail(`titre identique à ${seen.titles.get(title)}`)
    seen.titles.set(title, page)
  }

  const description = attr(html, /<meta name="description" content="([^"]*)"/)
  if (!description) fail('pas de meta description')
  else {
    if (description.length > 155) fail(`description trop longue (${description.length} > 155)`)
    if (seen.descriptions.has(description)) fail(`description identique à ${seen.descriptions.get(description)}`)
    seen.descriptions.set(description, page)
  }

  const robots = attr(html, /<meta name="robots" content="([^"]*)"/)
  if (!robots) fail('pas de meta robots')
  if (page !== '/404' && !/<link rel="canonical" href="https?:\/\/[^"]+"/.test(html)) fail('pas de canonical absolue')

  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? ''
  const words = decode(main.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ')).split(/\s+/).filter(Boolean)
  if (words.length < (page === '/404' ? 15 : 40)) fail(`contenu trop maigre dans <main> sans JavaScript (${words.length} mots)`)

  for (const [, href] of html.matchAll(/<a[^>]+href="([^"]+)"/g)) {
    if (href.startsWith('/') && !href.startsWith('//') && !resolves(decode(href))) fail(`lien cassé ${href}`)
    if (href.startsWith('tel:') && href !== PHONE) fail(`numéro inattendu ${href}`)
  }
  if (/0X XX XX XX XX|tel:\+33000000000/.test(html)) fail('ancien numéro provisoire présent')

  console.log(`✓ ${page.padEnd(42)} ${String(words.length).padStart(4)} mots · ${robots}`)
}

if (!existsSync(join(root, 'robots.txt')) || !existsSync(join(root, 'sitemap.xml'))) problems.push('robots.txt ou sitemap.xml manquant')

if (problems.length) {
  console.error(`\n✗ ${problems.length} problème(s) dans le HTML pré-rendu :\n- ${problems.join('\n- ')}`)
  process.exit(1)
}
console.log(`\n✓ ${files.length} pages pré-rendues vérifiées`)
