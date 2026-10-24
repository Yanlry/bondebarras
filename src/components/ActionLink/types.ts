import type { AnchorHTMLAttributes } from 'react'
import type { IconName } from '../Icon/types'

/** Variante visuelle d'un bouton-lien. */
export type ActionVariant = 'primary' | 'secondary' | 'ghost' | 'inverse' | 'ghost-inverse'

/** Props de {@link ActionLink}. */
export interface ActionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: ActionVariant
  size?: 'md' | 'lg' | 'sm'
  /** Icône « emportée » au survol. */
  icon?: IconName
}
