import type { MetaDescriptor } from 'react-router'
import { company } from '../data/company'
import { breadcrumbOf, getPage } from '../data/pages'
import { site } from '../data/site'
import type { PageId, PageInfo } from '../types/site'

/** Une page n'est indexable que si le site est publié et que ses contenus sont validés. */
export const isIndexable = (page: PageInfo): boolean => site.status === 'live' && page.status === 'ready'

/** URL absolue d'un chemin (sans barre finale, sauf l'accueil). */
export const absoluteUrl = (path: string): string => `${site.url.value}${path}`

/** Organisation : uniquement des informations confirmées (pas d'adresse, de zone ni d'avis tant qu'ils ne sont pas fournis). */
export function organizationLd(): Record<string, unknown> {
  const phone = company.phone.value.href.replace('tel:', '')
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    description: `${company.tagline}, pour les particuliers et les professionnels.`,
    telephone: phone,
    contactPoint: { '@type': 'ContactPoint', telephone: phone, contactType: 'customer service', availableLanguage: 'French' },
    ...(site.url.provisional ? {} : { url: absoluteUrl('/') }),
  }
}

/** Fil d'Ariane structuré (seulement avec un domaine confirmé : les URL doivent être absolues et réelles). */
function breadcrumbLd(id: PageId): Record<string, unknown> | null {
  const trail = breadcrumbOf(id)
  if (site.url.provisional || trail.length < 2) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((page, i) => ({ '@type': 'ListItem', position: i + 1, name: page.label, item: absoluteUrl(page.path) })),
  }
}

/**
 * Balises <head> d'une page (fonction `meta` des routes) : titre, description,
 * robots, canonical, Open Graph et données structurées. Pré-rendues dans le HTML.
 *
 * @param id Page concernée.
 * @param jsonLd Données structurées propres à la page (ex. `Service`).
 */
export function pageMeta(id: PageId, jsonLd: Array<Record<string, unknown>> = []): MetaDescriptor[] {
  const page = getPage(id)
  const url = absoluteUrl(page.path)
  const breadcrumb = breadcrumbLd(id)
  const structured = [...jsonLd, ...(breadcrumb ? [breadcrumb] : [])]
  return [
    { title: page.title },
    { name: 'description', content: page.description },
    { name: 'robots', content: isIndexable(page) ? 'index, follow' : 'noindex, nofollow' },
    ...(id === 'introuvable' ? [] : [{ tagName: 'link', rel: 'canonical', href: url }]),
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: site.locale },
    { property: 'og:site_name', content: site.name },
    { property: 'og:title', content: page.title },
    { property: 'og:description', content: page.description },
    { property: 'og:url', content: url },
    ...structured.map((data) => ({ 'script:ld+json': data })),
  ]
}
