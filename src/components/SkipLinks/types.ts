/** Un lien d'évitement. */
export interface SkipLink {
  label: string
  href: `#${string}`
}

/** Props de {@link SkipLinks}. */
export interface SkipLinksProps {
  links: readonly SkipLink[]
}
