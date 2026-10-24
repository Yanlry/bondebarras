import type { AnchorHTMLAttributes } from 'react'

/** Props de {@link SmartLink}. */
export interface SmartLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Chemin interne (`/devis`), ancre (`#contenu`) ou lien externe / `tel:`. */
  href: string
}
