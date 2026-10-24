/**
 * Valeur éventuellement provisoire : tant que `provisional` vaut `true`,
 * l'interface l'affiche comme telle (repère visuel + mention lue par les
 * lecteurs d'écran) et elle figure dans la liste « À compléter » du README.
 */
export interface Provisional<T> {
  value: T
  provisional: boolean
}

/** Numéro de téléphone : texte affiché et lien `tel:` (format international). */
export interface PhoneNumber {
  display: string
  href: string
}

/** Coordonnées et informations pratiques de l'entreprise. */
export interface Company {
  name: string
  /** Promesse courte, sous le logo. */
  tagline: string
  phone: Provisional<PhoneNumber>
  email: Provisional<string>
  address: Provisional<string>
  /** Zones d'intervention (villes, départements). */
  serviceArea: Provisional<string>
  hours: Provisional<string>
}
