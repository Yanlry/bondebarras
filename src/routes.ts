import { type RouteConfig, index, route } from '@react-router/dev/routes'
import { servicePages } from './data/services'

/** Développement uniquement : page de capture de la pièce 3D (images de secours). */
const isDev = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.NODE_ENV !== 'production'

/**
 * Routes du site. Les 7 pages de prestation partagent un module (`service-page`),
 * chacune avec son identifiant ; leur contenu vient de `data/services.ts`.
 */
export default [
  index('routes/home.tsx'),
  route('prestations', 'routes/prestations.tsx'),
  ...servicePages.map((page) => route(`prestations/${page.id}`, 'routes/service-page.tsx', { id: `prestation-${page.id}` })),
  route('entreprise', 'routes/entreprise.tsx'),
  route('devis', 'routes/devis.tsx'),
  route('contact', 'routes/contact.tsx'),
  route('mentions-legales', 'routes/mentions-legales.tsx'),
  route('confidentialite', 'routes/confidentialite.tsx'),
  route('sitemap.xml', 'routes/sitemap.ts'),
  route('robots.txt', 'routes/robots.ts'),
  ...(isDev ? [route('__capture', 'routes/dev-capture.tsx')] : []),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig
