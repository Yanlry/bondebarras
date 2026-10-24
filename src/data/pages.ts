import type { PageId, PageInfo } from '../types/site'

/**
 * Toutes les pages du site. Les titres et descriptions sont uniques ; leur longueur
 * est vérifiée au build (`scripts/check-html.mjs`).
 *
 * Toutes les pages sont `draft` tant que leurs contenus ne sont pas validés :
 * elles sont alors `noindex` et absentes du sitemap.
 */
export const pages: readonly PageInfo[] = [
  {
    id: 'accueil',
    path: '/',
    title: 'Bon Débarras · Débarras de maisons, caves et locaux',
    description:
      'Bon Débarras vide, trie et évacue maisons, appartements, caves, successions, bureaux et terrains, pour particuliers et professionnels. Devis gratuit.',
    label: 'Accueil',
    status: 'draft',
  },
  {
    id: 'prestations',
    path: '/prestations',
    title: 'Nos prestations de débarras · Bon Débarras',
    description:
      'Débarras de maisons, successions, locaux professionnels, terrains et chantiers, tri et recyclage : toutes nos prestations, avec devis gratuit.',
    label: 'Prestations',
    parent: 'accueil',
    status: 'draft',
  },
  {
    id: 'debarras-particuliers',
    path: '/prestations/debarras-particuliers',
    title: 'Débarras de maison et d’appartement · Bon Débarras',
    description:
      'Débarras de maison et d’appartement, de caves et de garages, enlèvement de meubles et d’encombrants, avant un déménagement ou une vente. Devis gratuit.',
    label: 'Particuliers',
    parent: 'prestations',
    status: 'draft',
  },
  {
    id: 'debarras-succession',
    path: '/prestations/debarras-succession',
    title: 'Débarras après décès et succession · Bon Débarras',
    description:
      'Débarras après un décès, une succession ou un départ en EHPAD, logements très encombrés : une intervention discrète et respectueuse. Devis gratuit.',
    label: 'Succession',
    parent: 'prestations',
    status: 'draft',
  },
  {
    id: 'debarras-professionnels',
    path: '/prestations/debarras-professionnels',
    title: 'Débarras de bureaux et locaux pro · Bon Débarras',
    description:
      'Débarras de bureaux, de commerces, d’entrepôts et d’ateliers, enlèvement de mobilier et de matériel professionnel inutilisé. Devis gratuit et personnalisé.',
    label: 'Professionnels',
    parent: 'prestations',
    status: 'draft',
  },
  {
    id: 'debarras-exterieur',
    path: '/prestations/debarras-exterieur',
    title: 'Débarras de terrain, jardin et chantier · Bon Débarras',
    description:
      'Débarras de terrains et de jardins, encombrants extérieurs ; déchets verts, gravats et dépôts sauvages sur étude de votre demande. Devis gratuit.',
    label: 'Extérieur et chantier',
    parent: 'prestations',
    status: 'draft',
  },
  {
    id: 'tri-recyclage',
    path: '/prestations/tri-recyclage',
    title: 'Tri, recyclage et valorisation · Bon Débarras',
    description:
      'Tri, réemploi, recyclage et évacuation vers les filières adaptées. Débarras gratuit possible si la valeur des biens couvre les frais, après évaluation.',
    label: 'Tri et recyclage',
    parent: 'prestations',
    status: 'draft',
  },
  {
    id: 'debarras-cave-grenier-garage',
    path: '/prestations/debarras-cave-grenier-garage',
    title: 'Débarras de cave, grenier et garage · Bon Débarras',
    description:
      'Débarras de caves, de greniers, de combles, de garages et de dépendances : nous trions, sortons et évacuons ce qui encombre. Devis gratuit.',
    label: 'Cave, grenier, garage',
    parent: 'prestations',
    status: 'draft',
  },
  {
    id: 'syndrome-de-diogene',
    path: '/prestations/syndrome-de-diogene',
    title: 'Débarras syndrome de Diogène · Bon Débarras',
    description:
      'Débarras de logements très encombrés, y compris en cas de syndrome de Diogène : une intervention sans jugement, en toute discrétion. Devis gratuit.',
    label: 'Syndrome de Diogène',
    parent: 'prestations',
    status: 'draft',
  },
  {
    id: 'entreprise',
    path: '/entreprise',
    title: 'Notre entreprise · Bon Débarras',
    description:
      'Bon Débarras accompagne particuliers et professionnels pour vider, trier et libérer leurs espaces : notre façon de travailler et nos engagements.',
    label: 'Notre entreprise',
    parent: 'accueil',
    status: 'draft',
  },
  {
    id: 'devis',
    path: '/devis',
    title: 'Devis gratuit pour votre débarras · Bon Débarras',
    description:
      'Décrivez votre besoin de débarras (maison, succession, locaux, terrain) et recevez un devis gratuit et personnalisé. Ou appelez le 06 62 83 26 57.',
    label: 'Devis gratuit',
    parent: 'accueil',
    status: 'draft',
  },
  {
    id: 'contact',
    path: '/contact',
    title: 'Contact · Bon Débarras · 06 62 83 26 57',
    description:
      'Contactez Bon Débarras par téléphone au 06 62 83 26 57 pour une question ou un débarras, ou demandez directement votre devis gratuit en ligne.',
    label: 'Contact',
    parent: 'accueil',
    status: 'draft',
  },
  {
    id: 'mentions-legales',
    path: '/mentions-legales',
    title: 'Mentions légales · Bon Débarras',
    description: 'Mentions légales du site Bon Débarras : éditeur, hébergement et propriété intellectuelle.',
    label: 'Mentions légales',
    parent: 'accueil',
    status: 'draft',
  },
  {
    id: 'confidentialite',
    path: '/confidentialite',
    title: 'Politique de confidentialité · Bon Débarras',
    description:
      'Comment Bon Débarras traite les informations transmises par le formulaire de devis, et comment exercer vos droits sur vos données personnelles.',
    label: 'Confidentialité',
    parent: 'accueil',
    status: 'draft',
  },
  {
    id: 'introuvable',
    path: '/404',
    title: 'Page introuvable · Bon Débarras',
    description: 'Cette page n’existe pas ou plus. Retrouvez nos prestations de débarras ou demandez votre devis gratuit.',
    label: 'Page introuvable',
    status: 'draft',
  },
]

const byId = new Map(pages.map((page) => [page.id, page]))

/** Métadonnées d'une page. */
export function getPage(id: PageId): PageInfo {
  const page = byId.get(id)
  if (!page) throw new Error(`Page inconnue : ${id}`)
  return page
}

/** Page correspondant à un chemin (sans tenir compte d'une barre finale). */
export function findPageByPath(path: string): PageInfo | undefined {
  const clean = path.length > 1 ? path.replace(/\/+$/, '') : path
  return pages.find((page) => page.path === clean)
}

/** Fil d'Ariane d'une page, de l'accueil à la page elle-même. */
export function breadcrumbOf(id: PageId): PageInfo[] {
  const trail: PageInfo[] = []
  let current: PageInfo | undefined = getPage(id)
  while (current) {
    trail.unshift(current)
    current = current.parent ? getPage(current.parent) : undefined
  }
  return trail
}
