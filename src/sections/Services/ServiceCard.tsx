import { memo } from 'react'
import { ActionLink } from '../../components/ActionLink'
import { QUOTE_ANCHOR } from '../../data/navigation'
import { cn } from '../../lib/cn'
import { quoteDraft } from '../../lib/quoteDraft'
import { ServiceLine } from './ServiceLine'
import type { ServiceCardProps } from './types'

/**
 * Une famille de prestations (future zone du plan d'architecte). Le bouton
 * présélectionne le bon type de débarras dans le formulaire de devis.
 */
export const ServiceCard = memo(function ServiceCard({ category }: ServiceCardProps) {
  return (
    <article
      id={`prestations-${category.id}`}
      aria-labelledby={`prestations-${category.id}-titre`}
      className={cn(
        'footprint flex flex-col rounded-2xl p-6 sm:p-8',
        category.tone === 'sober' ? 'border-ink-soft/25 bg-air-deep/50' : 'border-bleu/30 bg-white/55',
      )}
    >
      <p className="font-mono text-xs tracking-[0.12em] text-ink-soft uppercase">{category.audience}</p>
      <h3 id={`prestations-${category.id}-titre`} className="mt-2 font-display text-2xl leading-tight font-bold tracking-[-0.02em] text-ink sm:text-[1.7rem]">
        {category.title}
      </h3>
      <p className="mt-3 text-ink-soft">{category.summary}</p>
      <ul className="mt-5 space-y-2.5">
        {category.items.map((item) => (
          <ServiceLine key={item.label} item={item} />
        ))}
      </ul>
      <div className="mt-auto pt-7">
        <ActionLink href={QUOTE_ANCHOR} variant="secondary" icon="arrow" onClick={() => quoteDraft.selectType(category.quoteType)}>
          Devis pour ce débarras
        </ActionLink>
      </div>
    </article>
  )
})
