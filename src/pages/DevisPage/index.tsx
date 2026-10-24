import { ActionLink } from '../../components/ActionLink'
import { Breadcrumb } from '../../components/Breadcrumb'
import { Icon } from '../../components/Icon'
import { ProvisionalNotice } from '../../components/ProvisionalNotice'
import { ProvisionalText } from '../../components/Provisional'
import { company } from '../../data/company'
import { QuoteForm } from '../../sections/Quote/QuoteForm'

/**
 * /devis (version du socle) : le formulaire actuel, présélectionné depuis les
 * pages de prestation (`?type=`), et le téléphone. Le formulaire en 3 étapes,
 * les photos et l'envoi réel viendront à l'étape du devis ; d'ici là, la page
 * dit clairement que l'envoi n'est pas activé.
 */
export function DevisPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-28 pb-20 sm:px-8 sm:pt-32 sm:pb-28">
      <Breadcrumb page="devis" />
      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        <div>
          <p className="tag-kraft">Devis gratuit</p>
          <h1 className="mt-5 font-display text-[clamp(2.5rem,7vw,4.4rem)] leading-[0.95] font-extrabold tracking-[-0.045em] text-ink">
            Demander un devis gratuit
          </h1>
          <p className="mt-5 max-w-[42ch] text-lg leading-relaxed text-ink-soft">
            Décrivez votre besoin : le lieu, les volumes, vos contraintes. Votre devis est gratuit et personnalisé.
          </p>
          <div className="mt-8 rounded-[1.6rem] bg-bleu p-6 text-air lg:sticky lg:top-28">
            <p className="font-mono text-xs tracking-[0.14em] uppercase opacity-85">Plus rapide : par téléphone</p>
            <p className="mt-2 font-display text-3xl font-bold">{company.phone.value.display}</p>
            <p className="mt-1 flex items-center gap-2 text-sm opacity-85">
              <Icon name="clock" className="size-4" />
              <ProvisionalText value={company.hours} />
            </p>
            <ActionLink href={company.phone.value.href} variant="inverse" icon="phone" className="mt-5">
              Appeler maintenant
            </ActionLink>
          </div>
        </div>
        <div id="devis-formulaire" className="scroll-mt-24">
          <ProvisionalNotice title="Formulaire en cours de finalisation" className="mb-8">
            L’envoi en ligne n’est pas encore activé : votre demande ne nous parviendrait pas. Pour un devis, appelez-nous au{' '}
            <a href={company.phone.value.href} className="font-semibold text-bleu underline">
              {company.phone.value.display}
            </a>
            .
          </ProvisionalNotice>
          <QuoteForm />
        </div>
      </div>
    </div>
  )
}
