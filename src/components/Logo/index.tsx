import { cn } from '../../lib/cn'
import { AccentArrow } from '../BrandTitle/AccentArrow'
import type { LogoProps } from './types'

/**
 * Logo provisoire (TODO : remplacer par le logo définitif) : le mot
 * « Bon Débarras », dont l'accent du « é » est une flèche de sortie ↗.
 */
export function Logo({ className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-baseline font-display font-extrabold tracking-[-0.03em] text-ink', className)}>
      <span className="sr-only">Bon Débarras</span>
      <span aria-hidden="true" className="inline-flex items-baseline">
        Bon&nbsp;D
        <span className="relative inline-block">
          e
          <AccentArrow className="absolute top-[-0.04em] left-[0.21em] w-[0.28em] text-sangle" />
        </span>
        barras
      </span>
    </span>
  )
}
