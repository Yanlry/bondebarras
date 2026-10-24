import { company } from '../../data/company'
import { quoteLink } from '../../data/quote'
import { ActionLink } from '../ActionLink'
import type { CtaBandProps } from './types'

/** Bandeau d'appel au devis, en bas des pages secondaires : devis gratuit et téléphone. */
export function CtaBand({
  title = 'Un espace à libérer ?',
  text = 'Décrivez-nous la situation : votre devis est gratuit et personnalisé.',
  quoteType,
}: CtaBandProps) {
  return (
    <section aria-labelledby="cta-band-title" className="px-5 pb-20 sm:px-8 sm:pb-28">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-bleu px-6 py-12 text-air sm:px-12 sm:py-16">
        <span aria-hidden="true" className="absolute inset-y-0 right-[12%] w-16 bg-sangle/90 max-sm:hidden" />
        <span aria-hidden="true" className="absolute inset-y-0 right-[calc(12%+5.5rem)] border-l-2 border-dashed border-air/25 max-sm:hidden" />
        <div className="relative max-w-2xl">
          <h2 id="cta-band-title" className="font-display text-[clamp(2rem,5vw,3.2rem)] leading-[1] font-extrabold tracking-[-0.035em]">
            {title}
          </h2>
          <p className="mt-4 text-lg text-air/85">{text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ActionLink href={quoteLink(quoteType)} variant="inverse" size="lg" icon="arrow">
              Demander un devis gratuit
            </ActionLink>
            <ActionLink href={company.phone.value.href} variant="ghost-inverse" size="lg" icon="phone">
              {company.phone.value.display}
            </ActionLink>
          </div>
        </div>
      </div>
    </section>
  )
}
