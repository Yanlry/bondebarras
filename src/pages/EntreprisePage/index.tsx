import { ActionLink } from '../../components/ActionLink'
import { CtaBand } from '../../components/CtaBand'
import { PageIntro } from '../../components/PageIntro'
import { ProvisionalNotice } from '../../components/ProvisionalNotice'
import { ServicePageCard } from '../../components/ServicePageCard'
import { company } from '../../data/company'
import { QUOTE_PATH } from '../../data/navigation'
import { getServicePage, serviceCategories } from '../../data/services'
import type { WorkStep } from './types'

/** Déroulé d'une intervention, tel que décrit dans le périmètre fourni par Bon Débarras. */
const STEPS: readonly WorkStep[] = [
  { title: 'Vous nous décrivez votre besoin', text: 'Par téléphone ou avec le formulaire en ligne : le lieu, les volumes, vos contraintes.' },
  { title: 'Nous établissons votre devis', text: 'Un devis gratuit et personnalisé, adapté à votre situation.' },
  { title: 'Nous trions, chargeons, évacuons', text: 'Ce qui peut servir est valorisé, ce qui peut être recyclé l’est, le reste est évacué.' },
  { title: 'Nous vous rendons l’espace', text: 'Un nettoyage léger après le débarras : la place est faite.' },
]

/** Engagements tirés du périmètre fourni (aucun chiffre, label ou certification non confirmé). */
const COMMITMENTS: readonly WorkStep[] = [
  { title: 'Discrétion et respect', text: 'Particulièrement pour les successions et les logements très encombrés.' },
  { title: 'Devis gratuit et personnalisé', text: 'Chaque situation est différente : votre devis l’est aussi.' },
  { title: 'Tri et valorisation', text: 'Nous trions ce que nous enlevons, pour que ce qui peut servir serve encore.' },
  { title: 'Particuliers et professionnels', text: 'D’un appartement à un entrepôt, avec la même méthode.' },
]

/**
 * /entreprise (version du socle) : ce que nous faisons, notre façon de
 * travailler, nos engagements. « Qui sommes-nous » reste à compléter avec
 * Bon Débarras : rien n'est inventé.
 */
export function EntreprisePage() {
  return (
    <>
      <PageIntro
        page="entreprise"
        tag="Notre entreprise"
        title="Faire de la place, avec méthode"
        lede="Bon Débarras accompagne les particuliers et les professionnels qui souhaitent vider, désencombrer ou débarrasser un espace, de quelques meubles à un bâtiment entier."
        actions={
          <>
            <ActionLink href={QUOTE_PATH} size="lg" icon="arrow">
              Demander un devis gratuit
            </ActionLink>
            <ActionLink href="/contact" variant="secondary" size="lg">
              Nous contacter
            </ActionLink>
          </>
        }
      />

      <section aria-labelledby="ce-que-nous-faisons" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <h2 id="ce-que-nous-faisons" className="font-display text-[clamp(1.9rem,4.5vw,3rem)] leading-[1] font-extrabold tracking-[-0.035em] text-ink">
          Ce que nous faisons
        </h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {serviceCategories.map((category) => (
            <li key={category.id} className="grid">
              <ServicePageCard page={getServicePage(category.pageId)} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="notre-methode" className="bg-white/55">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <h2 id="notre-methode" className="font-display text-[clamp(1.9rem,4.5vw,3rem)] leading-[1] font-extrabold tracking-[-0.035em] text-ink">
            Notre façon de travailler
          </h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative rounded-[1.4rem] border-t-4 border-sangle bg-air p-6">
                <span className="font-mono text-sm text-ink-soft">0{i + 1}</span>
                <h3 className="mt-3 font-display text-xl leading-tight font-bold tracking-[-0.02em] text-ink">{step.title}</h3>
                <p className="mt-2 text-ink-soft">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="nos-engagements" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <h2 id="nos-engagements" className="font-display text-[clamp(1.9rem,4.5vw,3rem)] leading-[1] font-extrabold tracking-[-0.035em] text-ink">
          Nos engagements
        </h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {COMMITMENTS.map((item) => (
            <li key={item.title} className="rounded-[1.4rem] border-2 border-dashed border-bleu/30 p-6">
              <h3 className="font-display text-xl font-bold tracking-[-0.02em] text-ink">{item.title}</h3>
              <p className="mt-2 text-ink-soft">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="qui-sommes-nous" className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-24">
        <h2 id="qui-sommes-nous" className="font-display text-[clamp(1.9rem,4.5vw,3rem)] leading-[1] font-extrabold tracking-[-0.035em] text-ink">
          Qui sommes-nous
        </h2>
        <ProvisionalNotice title="À compléter avec Bon Débarras" className="mt-8 max-w-3xl">
          Histoire de l’entreprise, équipe, photos, zone d’intervention, statut juridique et assurances. Ces informations ne sont pas
          publiées tant qu’elles n’ont pas été fournies et validées. En attendant : {company.phone.value.display}.
        </ProvisionalNotice>
      </section>

      <CtaBand />
    </>
  )
}
