import type { ClientProfile, QuoteTypeId } from '../../types/quote'

/** Valeurs du formulaire de devis. */
export interface QuoteFormValues {
  profile: ClientProfile
  name: string
  phone: string
  email: string
  type: QuoteTypeId | ''
  postalCode: string
  city: string
  description: string
  date: string
  consent: boolean
}

/** État d'envoi du formulaire. */
export type QuoteStatus = 'idle' | 'invalid' | 'unavailable'
