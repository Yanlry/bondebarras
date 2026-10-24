/*
 * Transition entre les pages : une bande de scotch kraft et orange couvre
 * l'écran (≈ 0,22 s), la nouvelle page s'affiche dessous, puis la bande
 * repart (≈ 0,26 s). Transform seul (Web Animations API) ; aucune transition
 * avec `prefers-reduced-motion`.
 */

let band: HTMLElement | null = null
let covered = false

const COVER = { duration: 220, easing: 'cubic-bezier(0.7, 0, 0.3, 1)' } as const
const REVEAL = { duration: 260, easing: 'cubic-bezier(0.3, 0, 0.2, 1)' } as const
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const pageTransition = {
  /** Branche l'élément de la bande (composant PageTransition). Renvoie le débranchement. */
  attach(element: HTMLElement): () => void {
    band = element
    return () => {
      if (band === element) band = null
    }
  },
  /** La bande couvre l'écran ; la promesse se résout quand la page peut changer. */
  async cover(): Promise<void> {
    if (!band || reduced()) return
    covered = true
    band.style.visibility = 'visible'
    await band.animate([{ transform: 'translate3d(-115%, 0, 0)' }, { transform: 'translate3d(0, 0, 0)' }], { ...COVER, fill: 'forwards' })
      .finished
  },
  /** La bande libère l'écran (après l'affichage de la nouvelle page). */
  reveal(): void {
    if (!band || !covered) return
    covered = false
    const element = band
    void element
      .animate([{ transform: 'translate3d(0, 0, 0)' }, { transform: 'translate3d(115%, 0, 0)' }], { ...REVEAL, fill: 'forwards' })
      .finished.then(() => {
        if (!covered) element.style.visibility = 'hidden'
      })
  },
}
