import { useEffect, useRef, type RefObject } from 'react'
import { useLocation } from 'react-router'
import { ScrollTrigger } from '../lib/gsap'
import { pageTransition } from '../lib/pageTransition'

/**
 * Après chaque changement de page (pas au premier affichage) : retour en haut,
 * recalcul des scènes au scroll, focus sur le H1 (les lecteurs d'écran
 * annoncent la nouvelle page), annonce du titre, puis départ de la bande de transition.
 *
 * @param announcer Région `aria-live` qui annonce le titre de la nouvelle page.
 */
export function usePageChange(announcer: RefObject<HTMLElement | null>): void {
  const { pathname, hash } = useLocation()
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (!hash) window.scrollTo(0, 0)
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      const heading = document.querySelector<HTMLElement>('main h1')
      if (heading) {
        heading.tabIndex = -1
        heading.focus({ preventScroll: true })
      }
      if (announcer.current) announcer.current.textContent = document.title
      pageTransition.reveal()
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash, announcer])
}
