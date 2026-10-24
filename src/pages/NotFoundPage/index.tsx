import { ActionLink } from '../../components/ActionLink'
import { PlanDecor } from '../../components/PlanDecor'
import { planLayouts } from '../../data/planLayouts'
import { QUOTE_PATH } from '../../data/navigation'

/** Page introuvable : un plan vide, le carton témoin seul… et les chemins utiles. */
export function NotFoundPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 pt-32 pb-24 sm:px-8 lg:grid-cols-2 lg:items-center">
      <div>
        <p className="tag-kraft">Erreur 404</p>
        <h1 className="mt-5 font-display text-[clamp(2.5rem,7vw,4.6rem)] leading-[0.95] font-extrabold tracking-[-0.045em] text-ink">
          Cette page a déjà été débarrassée
        </h1>
        <p className="mt-5 max-w-[44ch] text-lg text-ink-soft">Elle n’existe pas ou plus. Voici de quoi retrouver votre chemin.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ActionLink href="/" size="lg" variant="secondary">
            Retour à l’accueil
          </ActionLink>
          <ActionLink href="/prestations" size="lg" variant="ghost">
            Nos prestations
          </ActionLink>
          <ActionLink href={QUOTE_PATH} size="lg" icon="arrow">
            Devis gratuit
          </ActionLink>
        </div>
      </div>
      {planLayouts.introuvable && <PlanDecor layout={planLayouts.introuvable} className="max-w-xl" />}
    </div>
  )
}
