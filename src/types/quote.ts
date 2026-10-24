/** Types de débarras proposés dans le formulaire de devis. */
export type QuoteTypeId =
  | 'maison'
  | 'cave'
  | 'succession'
  | 'ehpad'
  | 'tres-encombre'
  | 'bureaux'
  | 'entrepot'
  | 'exterieur'
  | 'chantier'
  | 'autre'

/** Une option du choix « type de débarras ». */
export interface QuoteTypeOption {
  id: QuoteTypeId
  label: string
}

/** Profil du demandeur. */
export type ClientProfile = 'particulier' | 'professionnel'
