import { useEffect, useState } from 'react'

/**
 * `true` une fois la page défilée au-delà de `ratio` hauteurs d'écran.
 * La barre d'actions mobile (Appeler / Devis) apparaît dès que les boutons
 * du hero ne sont plus à l'écran.
 *
 * @param ratio Seuil, en hauteurs de fenêtre.
 */
export function useScrolledPast(ratio = 0.35): boolean {
  const [past, setPast] = useState(false)

  useEffect(() => {
    let frame = 0
    const check = () => {
      frame = 0
      setPast(window.scrollY > window.innerHeight * ratio)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [ratio])

  return past
}
