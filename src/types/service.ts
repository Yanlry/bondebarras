import type { QuoteTypeId } from './quote'

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
