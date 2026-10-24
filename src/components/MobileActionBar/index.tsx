import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { company } from '../../data/company'
import { QUOTE_PATH } from '../../data/navigation'
import { useScrolledPast } from '../../hooks/useScrolledPast'
import { cn } from '../../lib/cn'
import { ActionLink } from '../ActionLink'

/**
 * Barre d'actions mobile (Appeler / Devis gratuit), sur toutes les pages, dès
 * que la page a un peu défilé. Elle s'efface quand un élément marqué
 * `data-hide-action-bar` est à l'écran (formulaire de devis, pied de page) :
 * elle n'y servirait à rien et masquerait des boutons.
 */
export function MobileActionBar() {
  const { pathname } = useLocation()
  const past = useScrolledPast(0.35)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const visible = new Set<Element>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target)
        else visible.delete(entry.target)
      }
      setHidden(visible.size > 0)
    })
    document.querySelectorAll('[data-hide-action-bar]').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [pathname])

  const shown = past && !hidden
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-trace bg-air/92 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 ease-out md:hidden',
        shown ? 'translate-y-0' : 'pointer-events-none translate-y-full',
      )}
      inert={!shown}
    >
      <div className="grid grid-cols-2 gap-3">
        <ActionLink href={company.phone.value.href} variant="secondary" icon="phone" className="w-full">
          Appeler
        </ActionLink>
        <ActionLink href={QUOTE_PATH} icon="arrow" className="w-full">
          Devis gratuit
        </ActionLink>
      </div>
    </div>
  )
}
