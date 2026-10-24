import { Icon } from '../../components/Icon'
import { Logo } from '../../components/Logo'
import { ProvisionalText } from '../../components/Provisional'
import { company } from '../../data/company'
import { navLinks } from '../../data/navigation'

/** Pied de page : coordonnées (provisoires tant qu'elles ne sont pas fournies), liens, mentions. */
export function Footer() {
  return (
    <footer id="contact" className="bg-ink text-air">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 pb-28 sm:px-8 md:grid-cols-3 md:pb-14">
        <div>
          <Logo className="text-3xl !text-air" />
          <p className="mt-3 max-w-[30ch] text-air/80">{company.tagline}, pour les particuliers et les professionnels.</p>
        </div>
        <address className="space-y-3 not-italic">
          <h2 className="font-mono text-xs tracking-[0.14em] text-air/70 uppercase">Contact</h2>
          <p className="flex items-center gap-2.5">
            <Icon name="phone" className="size-4 text-kraft" />
            <a href={company.phone.value.href} className="hover:underline">
              <ProvisionalText value={{ value: company.phone.value.display, provisional: company.phone.provisional }} />
            </a>
          </p>
          <p className="flex items-center gap-2.5">
            <Icon name="mail" className="size-4 text-kraft" />
            <ProvisionalText value={company.email} />
          </p>
          <p className="flex items-center gap-2.5">
            <Icon name="pin" className="size-4 text-kraft" />
            <ProvisionalText value={company.address} />
          </p>
          <p className="flex items-center gap-2.5">
            <Icon name="clock" className="size-4 text-kraft" />
            <ProvisionalText value={company.hours} />
          </p>
          <p className="text-air/80">
            Interventions : <ProvisionalText value={company.serviceArea} />
          </p>
        </address>
        <nav aria-label="Pied de page" className="space-y-3">
          <h2 className="font-mono text-xs tracking-[0.14em] text-air/70 uppercase">Le site</h2>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="block hover:underline">
              {link.label}
            </a>
          ))}
          <span className="provisional block text-air/80">Mentions légales (à venir)</span>
        </nav>
      </div>
    </footer>
  )
}
