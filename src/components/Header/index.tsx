import { motion } from 'framer-motion'
import { company } from '../../data/company'
import { navLinks, QUOTE_ANCHOR } from '../../data/navigation'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useScrolledPast } from '../../hooks/useScrolledPast'
import { cn } from '../../lib/cn'
import { ActionLink } from '../ActionLink'
import { Icon } from '../Icon'
import { Logo } from '../Logo'
import { ProvisionalText } from '../Provisional'
import type { HeaderProps } from './types'

/**
 * En-tête fixe : logo, navigation (desktop), téléphone et « Devis gratuit »
 * toujours à portée de clic, quelle que soit la scène affichée.
 */
export function Header({ play }: HeaderProps) {
  const still = usePrefersReducedMotion()
  // Dès que la page défile, un fond translucide garde l'en-tête lisible au-dessus du contenu.
  const scrolled = useScrolledPast(0.04)
  return (
    <motion.header
      initial={still ? false : { opacity: 0, y: -16 }}
      animate={play ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300',
        scrolled && 'bg-air/85 shadow-[0_1px_0_var(--color-trace)] backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8 lg:h-18">
        <a href="#accueil" className="rounded-md text-[1.35rem] sm:text-2xl" aria-label="Bon Débarras, retour en haut de page">
          <Logo />
        </a>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 rounded-full bg-air/80 p-1 backdrop-blur-md lg:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="rounded-full px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-air-deep">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={company.phone.value.href}
            className="inline-flex items-center gap-2 rounded-full bg-air/80 px-3 py-2.5 text-sm font-semibold text-bleu backdrop-blur-md transition-colors hover:bg-bleu-soft sm:px-4"
          >
            <Icon name="phone" className="size-4" />
            <span className="sr-only sm:not-sr-only">
              <ProvisionalText value={{ value: company.phone.value.display, provisional: company.phone.provisional }} />
            </span>
            <span className="sr-only">Appeler Bon Débarras</span>
          </a>
          <ActionLink href={QUOTE_ANCHOR} size="sm" className="sm:px-5 sm:py-2.5">
            Devis gratuit
          </ActionLink>
        </div>
      </div>
    </motion.header>
  )
}
