import { breadcrumbOf } from '../../data/pages'
import { cn } from '../../lib/cn'
import { SmartLink } from '../SmartLink'
import type { BreadcrumbProps } from './types'

/** Fil d'Ariane (liste ordonnée, page courante signalée), en police mono comme une étiquette. */
export function Breadcrumb({ page, className }: BreadcrumbProps) {
  const trail = breadcrumbOf(page)
  return (
    <nav aria-label="Fil d’Ariane" className={cn('font-mono text-xs tracking-[0.08em] text-ink-soft uppercase', className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {trail.map((item, i) => (
          <li key={item.id} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === trail.length - 1 ? (
              <span aria-current="page" className="text-ink">
                {item.label}
              </span>
            ) : (
              <SmartLink href={item.path} className="rounded-sm underline-offset-4 hover:text-bleu hover:underline">
                {item.label}
              </SmartLink>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
