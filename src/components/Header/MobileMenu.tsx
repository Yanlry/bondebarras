import { useEffect, useRef, useState } from 'react'
import { company } from '../../data/company'
import { getPage } from '../../data/pages'
import { mainNav, QUOTE_PATH } from '../../data/navigation'
import { servicePages } from '../../data/services'
import { cn } from '../../lib/cn'
import { ActionLink } from '../ActionLink'
import { Icon } from '../Icon'
import { SmartLink } from '../SmartLink'
import type { MobileMenuProps } from './types'

/**
 * Menu mobile plein écran (dialogue modal) : il descend comme la porte de
 * garage du chargement. Focus piégé dans le menu, Échap pour fermer (le focus
 * revient au bouton Menu), défilement de la page bloqué, prestations en
 * accordéon, Appeler et Devis gratuit toujours visibles en bas.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panel = useRef<HTMLDivElement>(null)
  const [servicesOpen, setServicesOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const element = panel.current
    const previous = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    element?.querySelector<HTMLElement>('a, button')?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !element) return
      const focusable = [...element.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter((node) => node.offsetParent !== null)
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus({ preventScroll: true })
    }
  }, [open, onClose])

  return (
    <div
      ref={panel}
      id="menu-mobile"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      data-open={open}
      className="mobile-menu fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-bleu text-air lg:hidden"
    >
      <div className="flex h-16 flex-none items-center justify-between px-4 sm:px-8">
        <span className="font-mono text-xs tracking-[0.16em] uppercase opacity-80">Menu</span>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/20"
        >
          Fermer
          <Icon name="close" className="size-4" />
        </button>
      </div>

      <nav aria-label="Navigation principale" className="flex-1 px-5 pt-4 sm:px-8">
        <ul className="space-y-1">
          {mainNav.map((link) =>
            link.href === '/prestations' ? (
              <li key={link.href}>
                <button
                  type="button"
                  aria-expanded={servicesOpen}
                  aria-controls="menu-mobile-prestations"
                  onClick={() => setServicesOpen((value) => !value)}
                  className="flex w-full items-center justify-between py-2 text-left font-display text-[2rem] leading-tight font-bold tracking-[-0.03em]"
                >
                  Prestations
                  <Icon name="chevron-down" className={cn('size-7 transition-transform duration-300', servicesOpen && 'rotate-180')} />
                </button>
                <ul id="menu-mobile-prestations" hidden={!servicesOpen} className="mb-3 ml-1 space-y-0.5 border-l-2 border-dashed border-air/30 pl-4">
                  <li>
                    <SmartLink href="/prestations" className="block py-2 font-semibold text-kraft-light">
                      Toutes nos prestations
                    </SmartLink>
                  </li>
                  {servicePages.map((page) => (
                    <li key={page.id}>
                      <SmartLink href={getPage(page.id).path} className="flex items-center gap-3 py-2 text-lg aria-[current=page]:text-kraft-light">
                        <Icon name={page.icon} className="size-5 opacity-80" />
                        {page.navLabel}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={link.href}>
                <SmartLink
                  href={link.href}
                  className="block py-2 font-display text-[2rem] leading-tight font-bold tracking-[-0.03em] aria-[current=page]:text-kraft-light"
                >
                  {link.label}
                </SmartLink>
              </li>
            ),
          )}
        </ul>
      </nav>

      <div className="grid flex-none grid-cols-2 gap-3 border-t border-air/15 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
        <ActionLink href={company.phone.value.href} variant="inverse" icon="phone" className="w-full">
          Appeler
        </ActionLink>
        <ActionLink href={QUOTE_PATH} icon="arrow" className="w-full">
          Devis gratuit
        </ActionLink>
      </div>
    </div>
  )
}
