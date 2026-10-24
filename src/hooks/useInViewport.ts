import { useEffect, useState, type RefObject } from 'react'

/**
 * `true` tant que l'élément est (au moins en partie) visible.
 *
 * Sert à mettre en pause la scène 3D hors écran : aucun rendu WebGL
 * inutile, donc batterie et FPS préservés sur mobile.
 *
 * @param ref Élément observé.
 * @param rootMargin Marge d'anticipation (ex. `200px` pour reprendre un peu avant).
 * @param initial Valeur avant la première mesure.
 */
export function useInViewport<T extends Element>(ref: RefObject<T | null>, rootMargin = '0px', initial = false): boolean {
  const [inView, setInView] = useState(initial)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), { rootMargin })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  return inView
}
