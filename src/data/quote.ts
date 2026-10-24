import type { QuoteTypeId, QuoteTypeOption } from '../types/quote'

/** Choix « type de débarras » du formulaire de devis. */
export const quoteTypes: readonly QuoteTypeOption[] = [
  { id: 'maison', label: 'Maison ou appartement' },
  { id: 'cave', label: 'Cave, grenier, garage' },
  { id: 'succession', label: 'Succession, après décès' },
  { id: 'ehpad', label: 'Départ en EHPAD' },
  { id: 'tres-encombre', label: 'Logement très encombré' },
  { id: 'bureaux', label: 'Bureaux, commerce' },
  { id: 'entrepot', label: 'Entrepôt, atelier' },
  { id: 'exterieur', label: 'Jardin, terrain' },
  { id: 'chantier', label: 'Gravats, déchets de chantier' },
  { id: 'autre', label: 'Autre besoin' },
]

/**
 * Adresse d'envoi du formulaire de devis.
 * TODO : choisir le service (formulaire hébergé, e-mail transactionnel…) et la renseigner.
 */
export const QUOTE_ENDPOINT: string | null = null

const quoteTypeIds = new Set<string>(quoteTypes.map((option) => option.id))

/** Lit un type de débarras depuis l'URL (`/devis?type=succession`) ; `null` s'il est inconnu. */
export function parseQuoteType(value: string | null): QuoteTypeId | null {
  return value && quoteTypeIds.has(value) ? (value as QuoteTypeId) : null
}

/** Lien vers le formulaire de devis, avec un type présélectionné. */
export const quoteLink = (type?: QuoteTypeId): string => (type ? `/devis?type=${type}` : '/devis')
