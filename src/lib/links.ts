/** `true` pour un chemin interne du site (`/…`), à ouvrir avec le routeur. */
export const isInternalHref = (href: string): boolean => href.startsWith('/') && !href.startsWith('//')

/** Chemin sans barre finale (le pré-rendu peut fournir `/devis/` pour `/devis`). */
export const normalizePath = (pathname: string): string => (pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname)
