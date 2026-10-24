import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * `false` pendant le pré-rendu et l'hydratation, puis `true` : permet de lire
 * l'URL ou le navigateur (ex. `?type=` du devis) sans écart entre le HTML
 * pré-rendu et le premier rendu du navigateur.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
