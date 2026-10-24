import { cn } from '../../lib/cn'
import type { ProvisionalTextProps } from './types'

/**
 * Affiche une information de l'entreprise. Si elle est encore provisoire
 * (placeholder), elle est soulignée en pointillés kraft, avec une infobulle
 * et une mention lue par les lecteurs d'écran : jamais présentée comme réelle.
 */
export function ProvisionalText({ value, className }: ProvisionalTextProps) {
  if (!value.provisional) return <span className={className}>{value.value}</span>
  return (
    <span className={cn('provisional', className)} title="Information provisoire, à compléter" data-provisional="">
      {value.value}
      <span className="sr-only"> (information provisoire)</span>
    </span>
  )
}
