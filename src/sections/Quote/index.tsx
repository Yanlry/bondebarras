import { ActionLink } from '../../components/ActionLink'
import { Icon } from '../../components/Icon'
import { ProvisionalText } from '../../components/Provisional'
import { company } from '../../data/company'
import { QuoteForm } from './QuoteForm'

/**
 * Demande de devis (version provisoire, avant la scène « La porte ») :
 * le formulaire et le téléphone, côte à côte. Rendu hors de toute zone
 * épinglée : la saisie et le clavier mobile ne sont jamais gênés.
 */
export function Quote() {
  return (
    <section id="devis" aria-labelledby="devis-titre" className="relative bg-white/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div>
          <p className="tag-kraft">Devis gratuit</p>
          <h2 id="devis-titre" className="mt-4 font-display text-[clamp(2.2rem,6vw,3.6rem)] leading-[0.98] font-extrabold tracking-[-0.04em] text-ink">
            Parlons de votre espace
          </h2>
          <p className="mt-4 max-w-[42ch] text-lg text-ink-soft">
            Décrivez-nous la situation : nous revenons vers vous avec un devis gratuit et personnalisé.
          </p>
          <div className="mt-8 rounded-2xl bg-bleu p-6 text-air">
            <p className="font-mono text-xs tracking-[0.14em] uppercase opacity-85">Plus rapide : par téléphone</p>
            <p className="mt-2 font-display text-3xl font-bold">
              <ProvisionalText value={{ value: company.phone.value.display, provisional: company.phone.provisional }} />
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm opacity-85">
              <Icon name="clock" className="size-4" />
              <ProvisionalText value={company.hours} />
            </p>
            <ActionLink href={company.phone.value.href} variant="inverse" icon="phone" className="mt-5">
              Appeler maintenant
            </ActionLink>
          </div>
        </div>
        <QuoteForm />
      </div>
    </section>
  )
}
