import { site } from '../data/site'
import { absoluteUrl } from '../lib/seo'

/**
 * /robots.txt, pré-rendu au build. Site en préparation : exploration bloquée
 * (et chaque page porte aussi `noindex`). Site publié : tout est ouvert, avec le sitemap.
 */
export function loader() {
  const body =
    site.status === 'live'
      ? `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`
      : `# Site en préparation : ne pas indexer.\nUser-agent: *\nDisallow: /\n`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
