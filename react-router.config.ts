import type { Config } from '@react-router/dev/config'
import { pages } from './src/data/pages'

/**
 * React Router en mode framework, sans serveur (`ssr: false`) : chaque page est
 * pré-rendue en HTML complet au build (contenu présent sans JavaScript), puis
 * reprise par le navigateur (hydratation). Hébergement statique suffisant.
 */
export default {
  appDirectory: 'src',
  buildDirectory: 'dist',
  ssr: false,
  prerender: [...pages.map((page) => page.path), '/sitemap.xml', '/robots.txt'],
} satisfies Config
