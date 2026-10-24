import { pages } from '../data/pages'
import { absoluteUrl, isIndexable } from '../lib/seo'

/**
 * /sitemap.xml, pré-rendu au build. Seules les pages indexables y figurent :
 * tant que le site est en préparation (`site.status = 'preview'`), il est vide.
 */
export function loader() {
  const urls = pages
    .filter(isIndexable)
    .map((page) => `  <url><loc>${absoluteUrl(page.path)}</loc></url>`)
    .join('\n')
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}${urls ? '\n' : ''}</urlset>\n`
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
