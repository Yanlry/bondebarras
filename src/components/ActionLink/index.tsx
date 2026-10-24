import { cn } from '../../lib/cn'
import { Icon } from '../Icon'
import type { ActionLinkProps, ActionVariant } from './types'

const VARIANTS: Record<ActionVariant, string> = {
  // Blanc sur sangle foncée : 5,6:1 (AA)
  primary: 'bg-sangle-deep text-white hover:bg-[#a03413] shadow-[0_10px_24px_-12px_rgb(185_61_23/0.7)]',
  secondary: 'border-2 border-bleu text-bleu hover:bg-bleu hover:text-white',
  ghost: 'text-ink hover:bg-air-deep',
  inverse: 'bg-air text-bleu hover:bg-white',
}

const SIZES = {
  sm: 'gap-2 px-4 py-2 text-sm',
  md: 'gap-2.5 px-5 py-3 text-base',
  lg: 'gap-2.5 px-5 py-3 text-base sm:gap-3 sm:px-7 sm:py-4 sm:text-lg',
} as const

/**
 * Bouton-lien de la marque (devis, appel, ancre). L'icône est « emportée »
 * hors du bouton au survol et une copie revient à sa place (CSS `.action`).
 */
export function ActionLink({ variant = 'primary', size = 'md', icon, className, children, ...props }: ActionLinkProps) {
  return (
    <a
      {...props}
      className={cn(
        'action inline-flex items-center justify-center rounded-full font-display font-semibold tracking-[-0.01em] whitespace-nowrap',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
    >
      <span>{children}</span>
      {icon && (
        <span className="action__icon" aria-hidden="true">
          <Icon name={icon} />
          <Icon name={icon} />
        </span>
      )}
    </a>
  )
}
