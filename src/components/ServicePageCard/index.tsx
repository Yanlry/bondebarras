import { memo } from 'react'
import { getPage } from '../../data/pages'
import { cn } from '../../lib/cn'
import { Icon } from '../Icon'
import { SmartLink } from '../SmartLink'
import type { ServicePageCardProps } from './types'

/**
 * Carte d'une prestation : pictogramme dans son empreinte, titre, une ligne,
 * et toute la carte mène à la page dédiée. Au survol, l'empreinte devient pleine.
 */
export const ServicePageCard = memo(function ServicePageCard({ page, headingLevel: Heading = 'h3' }: ServicePageCardProps) {
  const info = getPage(page.id)
  return (
    <article className="group relative flex flex-col rounded-[1.4rem] border-2 border-dashed border-bleu/30 bg-white/60 p-6 transition-[border-color,background-color] duration-300 focus-within:border-solid focus-within:border-bleu hover:border-solid hover:border-bleu hover:bg-white sm:p-7">
      <span
        aria-hidden="true"
        className={cn(
          'grid size-12 place-items-center rounded-xl border-2 border-dashed border-bleu/40 text-bleu transition-colors duration-300 group-hover:border-solid group-hover:bg-bleu group-hover:text-air',
          page.tone === 'sober' && 'border-ink-soft/40 text-ink-soft group-hover:bg-ink-soft',
        )}
      >
        <Icon name={page.icon} className="size-6" />
      </span>
      <Heading className="mt-5 font-display text-xl leading-tight font-bold tracking-[-0.02em] text-ink sm:text-2xl">
        <SmartLink href={info.path} className="after:absolute after:inset-0 after:rounded-[1.4rem] focus-visible:outline-none">
          {page.navLabel}
        </SmartLink>
      </Heading>
      <p className="mt-2 text-ink-soft">{page.menuDescription}</p>
      <span aria-hidden="true" className="mt-auto inline-flex items-center gap-2 pt-6 font-display font-semibold text-bleu">
        Découvrir
        <Icon name="arrow" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </article>
  )
})
