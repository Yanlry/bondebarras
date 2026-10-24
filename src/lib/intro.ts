/*
 * État d'arrivée sur le site, partagé entre l'écran de chargement et le hero :
 *
 * - `sceneReady` : la 3D du hero a rendu sa première image (ou ne sera pas
 *   affichée : pas de WebGL) ;
 * - `started` : l'écran de chargement se lève, l'intro du hero peut jouer.
 *
 * Un simple « store » externe (lu via `useSyncExternalStore`) : pas besoin de
 * contexte React, et l'écran de chargement peut le lire hors rendu.
 */

type Listener = () => void

const state = { sceneReady: false, started: false }
const listeners = new Set<Listener>()

const emit = () => listeners.forEach((listener) => listener())

export const intro = {
  /** Abonnement aux changements (renvoie le désabonnement). */
  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  isSceneReady: () => state.sceneReady,
  isStarted: () => state.started,
  /** La scène 3D du hero est prête (ou absente). */
  markSceneReady(): void {
    if (state.sceneReady) return
    state.sceneReady = true
    emit()
  },
  /** L'écran de chargement s'en va : place à l'intro. */
  start(): void {
    if (state.started) return
    state.started = true
    emit()
  },
}
