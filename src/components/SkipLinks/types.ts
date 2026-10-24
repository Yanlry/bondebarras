/** Un lien d'évitement (ancre de la page, ou page du devis). */
export interface SkipLink {
  label: string
  href: string
}

/** Props de {@link SkipLinks}. */
export interface SkipLinksProps {
  links: readonly SkipLink[]
}
