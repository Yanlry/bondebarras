import { useSyncExternalStore } from 'react'
import { intro } from '../lib/intro'

/**
 * `true` une fois l'écran de chargement levé : le hero attend ce signal pour
 * lancer son intro (titre qui se range, objets qui tombent dans la pièce).
 */
export function useIntroStarted(): boolean {
  return useSyncExternalStore(intro.subscribe, intro.isStarted, () => false)
}
