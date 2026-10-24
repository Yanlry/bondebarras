import { Icon } from '../../components/Icon'
import { Logo } from '../../components/Logo'
import { ProvisionalText } from '../../components/Provisional'
import { SmartLink } from '../../components/SmartLink'
import { company } from '../../data/company'
import { getPage } from '../../data/pages'
import { legalNav, QUOTE_PATH } from '../../data/navigation'
import { servicePages } from '../../data/services'
import { site } from '../../data/site'

/** Année du build (pré-rendu) : identique au HTML et à l'hydratation. */
const YEAR = new Date().getFullYear()

const linkClass = 'rounded-sm text-air/85 transition-colors hover:text-white hover:underline'
const titleClass = 'font-mono text-xs tracking-[0.14em] text-air/60 uppercase'

/**
 * Pied de page de toutes les pages : présentation, téléphone, prestations,
 * entreprise, informations pratiques (provisoires signalées), liens légaux.
 * Tant que le site est en préparation, il l'indique.
 */
export function Footer() {
  return (
    <footer className="relative bg-ink text-air" data-hide-action-bar>
      <div className="mx-auto grid max-w-7xl gap-12 px-5 pt-16 pb-10 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.9fr_1fr]">
        <div>
          <Logo className="text-3xl !text-air" />
          <p className="mt-4 max-w-[32ch] text-air/80">{company.tagline}, pour les particuliers et les professionnels.</p>
          <a
            href={company.phone.value.href}
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-white/8 px-5 py-3 font-display text-xl font-bold transition-colors hover:bg-white/15"
          >
            <Icon name="phone" className="size-5 text-kraft" />
            {company.phone.value.display}
          </a>
          <SmartLink href={QUOTE_PATH} className="mt-3 flex w-fit items-center gap-2 font-semibold text-kraft-light hover:underline">
            Demander un devis gratuit
            <Icon name="arrow" className="size-4" />
          </SmartLink>
        </div>

        <nav aria-labelledby="footer-prestations">
          <h2 id="footer-prestations" className={titleClass}>
            Prestations
          </h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <SmartLink href="/prestations" className={linkClass}>
                Toutes nos prestations
              </SmartLink>
            </li>
            {servicePages.map((page) => (
              <li key={page.id}>
                <SmartLink href={getPage(page.id).path} className={linkClass}>
                  {page.navLabel}
                </SmartLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-entreprise">
          <h2 id="footer-entreprise" className={titleClass}>
            Bon Débarras
          </h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <SmartLink href="/entreprise" className={linkClass}>
                Notre entreprise
              </SmartLink>
            </li>
            <li>
              <SmartLink href="/contact" className={linkClass}>
                Contact
              </SmartLink>
            </li>
            <li>
              <SmartLink href={QUOTE_PATH} className={linkClass}>
                Devis gratuit
              </SmartLink>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className={titleClass}>Informations</h2>
          <ul className="mt-4 space-y-3 text-air/85">
            <li className="flex gap-2.5">
              <Icon name="mail" className="mt-0.5 size-4 flex-none text-kraft" />
              <ProvisionalText value={company.email} />
            </li>
            <li className="flex gap-2.5">
              <Icon name="pin" className="mt-0.5 size-4 flex-none text-kraft" />
              <ProvisionalText value={company.address} />
            </li>
            <li className="flex gap-2.5">
              <Icon name="clock" className="mt-0.5 size-4 flex-none text-kraft" />
              <ProvisionalText value={company.hours} />
            </li>
            <li>
              Interventions : <ProvisionalText value={company.serviceArea} />
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-air/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-6 text-sm text-air/65 sm:px-8">
          <p>© {YEAR} Bon Débarras</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((link) => (
              <li key={link.href}>
                <SmartLink href={link.href} className={linkClass}>
                  {link.label}
                </SmartLink>
              </li>
            ))}
          </ul>
          {site.status === 'preview' && (
            <p className="w-full font-mono text-xs tracking-[0.08em] uppercase sm:w-auto">Site en préparation · informations à compléter</p>
          )}
        </div>
      </div>
    </footer>
  )
}
