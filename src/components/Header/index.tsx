import { useCallback, useState } from 'react'
import { useLocation } from 'react-router'
import { company } from '../../data/company'
import { mainNav, QUOTE_PATH } from '../../data/navigation'
import { useScrolledPast } from '../../hooks/useScrolledPast'
import { cn } from '../../lib/cn'
import { normalizePath } from '../../lib/links'
import { ActionLink } from '../ActionLink'
import { Icon } from '../Icon'
import { Logo } from '../Logo'
import { SmartLink } from '../SmartLink'
import { MobileMenu } from './MobileMenu'
import { PrestationsMenu } from './PrestationsMenu'
import type { HeaderProps } from './types'

/**
 * En-tête fixe de toutes les pages.
 * - Desktop : logo · Accueil · Prestations (menu) · Notre entreprise · Contact ·
 *   téléphone · Devis gratuit.
 * - Mobile : logo · téléphone · Devis gratuit · Menu (plein écran).
 * Fond translucide dès que la page défile. Apparition en fondu sur l'accueil,
 * une fois l'écran de chargement levé.
 */
export function Header({ play, animateIn }: HeaderProps) {
  const pathname = normalizePath(useLocation().pathname)
  const scrolled = useScrolledPast(0.04)
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  // Changement de page : le menu mobile se ferme.
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setMenuOpen(false)
  }

  // Le menu mobile est rendu à côté de l'en-tête, pas dedans : le `transform` et le
  // `backdrop-filter` de l'en-tête limiteraient sinon son `position: fixed` à l'en-tête.
  return (
    <>
    <header
      data-intro
      // Entrée (accueil, après l'écran de chargement) : transition CSS, sans Framer Motion
      // (les pages secondaires n'ont pas à le télécharger).
      data-enter={animateIn ? (play ? 'done' : 'pending') : undefined}
      className={cn(
        'header-enter fixed inset-x-0 top-0 z-50',
        scrolled && 'bg-air/85 shadow-[0_1px_0_var(--color-trace)] backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-8 lg:h-18">
        <SmartLink href="/" className="rounded-md text-[1.35rem] sm:text-2xl" aria-label="Bon Débarras, accueil">
          <Logo />
        </SmartLink>

        <nav aria-label="Navigation principale" className="hidden items-center gap-0.5 rounded-full bg-air/80 p-1 backdrop-blur-md lg:flex">
          {mainNav.map((link) =>
            link.href === '/prestations' ? (
              <PrestationsMenu key={link.href} pathname={pathname} />
            ) : (
              <SmartLink
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-air-deep aria-[current=page]:bg-white aria-[current=page]:text-bleu"
              >
                {link.label}
              </SmartLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href={company.phone.value.href}
            className="inline-flex items-center gap-2 rounded-full bg-air/80 px-3 py-2.5 text-sm font-semibold text-bleu backdrop-blur-md transition-colors hover:bg-bleu-soft xl:px-4"
          >
            <Icon name="phone" className="size-4" />
            <span className="sr-only xl:not-sr-only">{company.phone.value.display}</span>
            <span className="sr-only">Appeler Bon Débarras au {company.phone.value.display}</span>
          </a>
          <ActionLink href={QUOTE_PATH} size="sm" className="max-[399px]:px-3.5 sm:px-5 sm:py-2.5">
            {/* Très petits écrans : libellé court, le devis reste toujours accessible */}
            <span className="min-[400px]:hidden">Devis</span>
            <span className="max-[399px]:hidden">Devis gratuit</span>
          </ActionLink>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            onClick={() => setMenuOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-2.5 text-sm font-semibold text-air lg:hidden"
          >
            <Icon name="menu" className="size-4" />
            <span className="max-sm:sr-only">Menu</span>
          </button>
        </div>
      </div>
    </header>
    <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  )
}
