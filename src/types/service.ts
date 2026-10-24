import type { QuoteTypeId } from './quote'
import type { PageId } from './site'

/** Identifiant d'une grande famille de prestations (une zone du plan d'architecte). */
export type ServiceCategoryId = 'particuliers' | 'succession' | 'professionnels' | 'exterieur'

/**
 * Engagement affiché pour une prestation :
 * - `confirmed` : prestation du périmètre, présentée normalement ;
 * - `onRequest` : présentée « sur étude » (validation opérationnelle en attente,
 *   ex. déchets particuliers) — jamais comme une prestation garantie ;
 * - `conditional` : soumise à condition, précisée par `note`.
 */
export type ServiceAvailability = 'confirmed' | 'onRequest' | 'conditional'

/** Une prestation. */
export interface ServiceItem {
  label: string
  availability: ServiceAvailability
  /** Précision affichée sous la prestation (condition, réserve). */
  note?: string
}

/** Une famille de prestations. */
export interface ServiceCategory {
  id: ServiceCategoryId
  /** Page dédiée à cette famille. */
  pageId: ServicePageId
  /** Titre court (h3). */
  title: string
  /** À qui elle s'adresse, en une ligne. */
  audience: string
  /** Pastille courte du hero (« Votre situation »). */
  chip: string
  summary: string
  items: readonly ServiceItem[]
  /** Type présélectionné dans le formulaire quand on demande un devis depuis cette famille. */
  quoteType: QuoteTypeId
  /** `sober` : situation délicate (succession…) traitée sans effet spectaculaire. */
  tone: 'standard' | 'sober'
}

/** Identifiant d'une page de prestation (sous /prestations). */
export type ServicePageId = Extract<
  PageId,
  | 'debarras-particuliers'
  | 'debarras-succession'
  | 'debarras-professionnels'
  | 'debarras-exterieur'
  | 'tri-recyclage'
  | 'debarras-cave-grenier-garage'
  | 'syndrome-de-diogene'
>

/** Pictogramme au trait d'une prestation (menus, cartes). */
export type ServiceIcon = 'house' | 'frame' | 'office' | 'leaf' | 'recycle' | 'stairs' | 'door'

/** Une page de prestation : contenu de base (enrichi à l'étape des pages de prestation). */
export interface ServicePage {
  id: ServicePageId
  /** Titre court (menus, cartes). */
  navLabel: string
  /** Une ligne d'explication (menu Prestations, cartes). */
  menuDescription: string
  icon: ServiceIcon
  /** H1 de la page. */
  h1: string
  /** Accroche sous le H1. */
  lede: string
  /** Titre de la liste des prestations (H2). */
  itemsTitle: string
  items: readonly ServiceItem[]
  /** Type présélectionné dans le formulaire de devis (`/devis?type=…`). */
  quoteType: QuoteTypeId
  tone: 'standard' | 'sober'
  /** Prestations associées (liens internes). */
  related: readonly ServicePageId[]
}
