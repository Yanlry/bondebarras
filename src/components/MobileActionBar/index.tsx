import { useEffect, useState } from 'react'
import { company } from '../../data/company'
import { QUOTE_ANCHOR } from '../../data/navigation'
import { useScrolledPast } from '../../hooks/useScrolledPast'
import { cn } from '../../lib/cn'
import { ActionLink } from '../ActionLink'

/**
 * Barre d'actions mobile (Appeler / Devis gratuit), fixée en bas de l'écran
 * dès que les boutons du hero ne sont plus visibles. Elle s'efface quand le
 * formulaire de devis est à l'écran (inutile, et elle masquerait le bouton d'envoi).
 */
export function MobileActionBar() {
  const past = useScrolledPast(0.35)
  const [quoteVisible, setQuoteVisible] = useState(false)

  useEffect(() => {
    const quote = document.querySelector(QUOTE_ANCHOR)
    if (!quote) return
    const observer = new IntersectionObserver(([entry]) => setQuoteVisible(Boolean(entry?.isIntersecting)))
    observer.observe(quote)
    return () => observer.disconnect()
  }, [])

  const shown = past && !quoteVisible
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
        <ActionLink href={QUOTE_ANCHOR} icon="arrow" className="w-full">
          Devis gratuit
        </ActionLink>
      </div>
    </div>
  )
}
