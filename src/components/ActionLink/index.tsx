import { cn } from '../../lib/cn'
import { Icon } from '../Icon'
import { SmartLink } from '../SmartLink'
import type { ActionLinkProps, ActionVariant } from './types'

const VARIANTS: Record<ActionVariant, string> = {
  // Blanc sur sangle foncée : 5,6:1 (AA)
  primary: 'bg-sangle-deep text-white hover:bg-[#a03413] shadow-[0_10px_24px_-12px_rgb(185_61_23/0.7)]',
  secondary: 'border-2 border-bleu text-bleu hover:bg-bleu hover:text-white',
  ghost: 'text-ink hover:bg-air-deep',
  inverse: 'bg-air text-bleu hover:bg-white',
  // Sur fond sombre (bandeau bleu) : texte clair, survol translucide
  'ghost-inverse': 'border-2 border-air/35 text-air hover:border-air hover:bg-white/10',
}

const SIZES = {
  sm: 'gap-2 px-4 py-2 text-sm',
  md: 'gap-2.5 px-5 py-3 text-base',
  lg: 'gap-2.5 px-5 py-3 text-base sm:gap-3 sm:px-7 sm:py-4 sm:text-lg',
} as const

/**
 * Bouton-lien de la marque (page, appel, ancre — via `SmartLink`). L'icône est
 * « emportée » hors du bouton au survol et une copie revient à sa place (CSS `.action`).
 */
export function ActionLink({ variant = 'primary', size = 'md', icon, className, children, ...props }: ActionLinkProps) {
  return (
    <SmartLink
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
    </SmartLink>
  )
}
