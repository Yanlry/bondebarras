import { useCallback, useSyncExternalStore } from 'react'

/**
 * Abonne le composant à une media query CSS.
 *
 * Basé sur `useSyncExternalStore` : pas de rendu intermédiaire incohérent,
 * et la valeur suit en direct la rotation d'écran ou les réglages d'accessibilité.
 *
 * @param query Media query, ex. `(min-width: 768px)`.
 * @returns `true` si la media query correspond.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
