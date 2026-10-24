import { ActionLink } from '../../components/ActionLink'
import { CtaBand } from '../../components/CtaBand'
import { PageIntro } from '../../components/PageIntro'
import { ServicePageCard } from '../../components/ServicePageCard'
import { company } from '../../data/company'
import { planLayouts } from '../../data/planLayouts'
import { quoteLink } from '../../data/quote'
import { getServicePage } from '../../data/services'
import { cn } from '../../lib/cn'
import { ServiceLine } from '../../sections/Services/ServiceLine'
import type { ServicePageViewProps } from './types'

/**
 * Page d'une prestation (version du socle) : introduction, ce que nous prenons
 * en charge, prestations associées, devis présélectionné. Le déroulé, les
 * conseils, les questions fréquentes et l'illustration narrative propre à la
 * page viendront à l'étape des pages de prestation.
 */
export function ServicePageView({ id }: ServicePageViewProps) {
  const page = getServicePage(id)
  const sober = page.tone === 'sober'
  return (
    <>
      <PageIntro
        page={id}
        tag={page.navLabel}
        title={page.h1}
        lede={page.lede}
        plan={planLayouts[id]}
        sober={sober}
        actions={
          <>
            <ActionLink href={quoteLink(page.quoteType)} size="lg" icon="arrow">
              Devis gratuit
            </ActionLink>
            <ActionLink href={company.phone.value.href} variant="secondary" size="lg" icon="phone">
              {company.phone.value.display}
            </ActionLink>
          </>
        }
      />

      <section aria-labelledby="prise-en-charge" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 id="prise-en-charge" className="font-display text-[clamp(1.9rem,4.5vw,3rem)] leading-[1] font-extrabold tracking-[-0.035em] text-ink">
            {page.itemsTitle}
          </h2>
          <ul className={cn('grid gap-4 rounded-[1.6rem] p-6 text-lg sm:p-8', sober ? 'bg-air-deep/60' : 'bg-white/60')}>
            {page.items.map((item) => (
              <ServiceLine key={item.label} item={item} />
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="prestations-associees" className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-24">
        <h2 id="prestations-associees" className="font-display text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.02] font-extrabold tracking-[-0.03em] text-ink">
          Prestations associées
        </h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {page.related.map((relatedId) => (
            <li key={relatedId} className="grid">
              <ServicePageCard page={getServicePage(relatedId)} />
            </li>
          ))}
        </ul>
      </section>

      <CtaBand quoteType={page.quoteType} />
    </>
  )
}
