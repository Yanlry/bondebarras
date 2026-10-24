import type { QuoteTypeId } from '../../types/quote'

/** Props de {@link CtaBand}. */
export interface CtaBandProps {
  title?: string
  text?: string
  /** Type présélectionné dans le formulaire de devis. */
  quoteType?: QuoteTypeId
}
