import { ActionLink } from '../../components/ActionLink'
import { CtaBand } from '../../components/CtaBand'
import { PageIntro } from '../../components/PageIntro'
import { ServicePageCard } from '../../components/ServicePageCard'
import { company } from '../../data/company'
import { QUOTE_PATH } from '../../data/navigation'
import { planLayouts } from '../../data/planLayouts'
import { complementaryServices, servicePages } from '../../data/services'
import { ServiceLine } from '../../sections/Services/ServiceLine'

/**
 * /prestations — toutes les prestations (version du socle) : introduction, les
 * 7 pages dédiées en cartes, et ce qui accompagne chaque intervention.
 * Le plan d'architecte interactif viendra à l'étape des pages de prestation.
 */
export function PrestationsPage() {
  return (
    <>
      <PageIntro
        page="prestations"
        tag="Nos prestations"
        title="Tous nos débarras, pour chaque espace"
        lede="Particuliers ou professionnels, quelques meubles ou un bâtiment entier : choisissez votre situation pour découvrir comment nous intervenons."
        plan={planLayouts.prestations}
        actions={
          <>
            <ActionLink href={QUOTE_PATH} size="lg" icon="arrow">
              Demander un devis gratuit
            </ActionLink>
            <ActionLink href={company.phone.value.href} variant="secondary" size="lg" icon="phone">
              Appeler
            </ActionLink>
          </>
        }
      />

      <section aria-labelledby="liste-prestations" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <h2 id="liste-prestations" className="font-display text-[clamp(1.9rem,4.5vw,3rem)] leading-[1] font-extrabold tracking-[-0.035em] text-ink">
          Votre situation
        </h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {servicePages.map((page) => (
            <li key={page.id} className="grid">
              <ServicePageCard page={page} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="avec-chaque-intervention" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="grid gap-8 rounded-[2rem] border-2 border-dashed border-bleu/25 px-6 py-10 sm:px-10 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 id="avec-chaque-intervention" className="font-display text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.02] font-extrabold tracking-[-0.03em] text-ink">
            Avec chaque intervention
          </h2>
          <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {complementaryServices.map((item) => (
              <ServiceLine key={item.label} item={item} />
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
