import { ActionLink } from '../../components/ActionLink'
import { Breadcrumb } from '../../components/Breadcrumb'
import { Icon } from '../../components/Icon'
import { ProvisionalText } from '../../components/Provisional'
import { company } from '../../data/company'
import { QUOTE_PATH } from '../../data/navigation'

/**
 * /contact (version du socle) : le téléphone en grand, sur une étiquette kraft,
 * les autres coordonnées (provisoires signalées) et l'accès au devis.
 */
export function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-28 pb-20 sm:px-8 sm:pt-32 sm:pb-28">
      <Breadcrumb page="contact" />
      <p className="tag-kraft mt-8">Contact</p>
      <h1 className="mt-5 max-w-[14ch] font-display text-[clamp(2.5rem,7vw,4.9rem)] leading-[0.95] font-extrabold tracking-[-0.045em] text-ink">
        Nous contacter
      </h1>
      <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-ink-soft">
        Le plus simple est de nous appeler. Pour une demande de devis, le formulaire en ligne vous permet de décrire votre besoin.
      </p>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* L'étiquette à bagage : le numéro en grand */}
        <section aria-labelledby="contact-telephone" className="relative overflow-hidden rounded-[2rem] bg-kraft-light p-8 sm:p-12">
          <span aria-hidden="true" className="absolute top-8 right-8 size-6 rounded-full border-4 border-air bg-kraft sm:top-12 sm:right-12" />
          <h2 id="contact-telephone" className="font-mono text-xs tracking-[0.14em] text-ink uppercase">
            Par téléphone
          </h2>
          <a
            href={company.phone.value.href}
            className="mt-4 block font-display text-[clamp(2.4rem,8vw,4.6rem)] leading-none font-extrabold tracking-[-0.03em] text-ink hover:text-bleu"
          >
            {company.phone.value.display}
          </a>
          <p className="mt-4 flex items-center gap-2 text-ink-soft">
            <Icon name="clock" className="size-4" />
            <ProvisionalText value={company.hours} />
          </p>
          <ActionLink href={company.phone.value.href} size="lg" icon="phone" className="mt-8">
            Appeler maintenant
          </ActionLink>
        </section>

        <div className="grid gap-6">
          <section aria-labelledby="contact-devis" className="rounded-[2rem] bg-bleu p-8 text-air">
            <h2 id="contact-devis" className="font-display text-2xl font-bold tracking-[-0.02em]">
              Un débarras à prévoir ?
            </h2>
            <p className="mt-2 text-air/85">Décrivez-nous la situation, votre devis est gratuit.</p>
            <ActionLink href={QUOTE_PATH} variant="inverse" icon="arrow" className="mt-6">
              Demander un devis
            </ActionLink>
          </section>
          <section aria-labelledby="contact-coordonnees" className="rounded-[2rem] border-2 border-dashed border-bleu/30 p-8">
            <h2 id="contact-coordonnees" className="font-display text-2xl font-bold tracking-[-0.02em] text-ink">
              Coordonnées
            </h2>
            <ul className="mt-4 space-y-3 text-ink-soft">
              <li className="flex gap-2.5">
                <Icon name="mail" className="mt-0.5 size-4 flex-none text-bleu" />
                <ProvisionalText value={company.email} />
              </li>
              <li className="flex gap-2.5">
                <Icon name="pin" className="mt-0.5 size-4 flex-none text-bleu" />
                <ProvisionalText value={company.address} />
              </li>
              <li>
                Interventions : <ProvisionalText value={company.serviceArea} />
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
