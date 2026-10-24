import type { RefObject } from 'react'
import { gsap } from '../lib/gsap'
import type { RoomProgress } from '../types/room'
import { useScrollScene } from './useScrollScene'

/** Options de {@link useRoomScene}. */
export interface RoomSceneOptions {
  /** Section épinglée (sa traversée pilote toute la scène). */
  trigger: RefObject<HTMLElement | null>
  /** Avancement lu par la 3D à chaque frame (écrit ici par la timeline). */
  progress: RefObject<RoomProgress>
  /** `false` sans 3D : section statique (images avant / après). */
  enabled: boolean
}

/**
 * Scène « La pièce pleine → Place nette », scrubbée sur le scroll.
 *
 * Repères de la timeline (unités arbitraires, ≈ 10 au total) :
 * - 0 → 1,5 : le texte du hero s'efface, la pièce glisse vers le centre (`focus`) ;
 * - 1,3 → 8,5 : les objets quittent la pièce un à un (`clear`), la jauge se
 *   remplit, les trois légendes « On trie / On porte / On évacue » se relaient ;
 * - 7,6 → 9,2 : la lumière revient (`light`), poussière et empreintes s'effacent ;
 * - 8,9 → 10 : « Bon débarras. » et l'appel au devis apparaissent.
 *
 * Le DOM est écrit dans son état statique (hero lisible, texte final
 * visible) : la timeline en part par des `fromTo` et y revient en remontant.
 * En mode statique, la 3D reste sur la pièce pleine du hero et l'image
 * « après » accompagne le texte final.
 */
export function useRoomScene({ trigger, progress, enabled }: RoomSceneOptions): void {
  useScrollScene({
    trigger,
    enabled,
    animate: (timeline) => {
      const q = gsap.utils.selector(trigger)
      const state = progress.current
      const captions = q('[data-clear-caption]')

      timeline
        .fromTo(q('[data-hero-copy]'), { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -56, duration: 1, ease: 'power2.in' }, 0)
        .fromTo(q('[data-scroll-cue]'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.4 }, 0)
        .fromTo(state, { focus: 0 }, { focus: 1, duration: 1.5, ease: 'power2.inOut' }, 0.05)
        .fromTo(q('[data-clear-progress]'), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.1)
        .fromTo(state, { clear: 0 }, { clear: 1, duration: 7.2 }, 1.3)
        .fromTo(q('[data-gauge-fill]'), { scaleX: 0 }, { scaleX: 1, duration: 7.2 }, 1.3)

      captions.forEach((caption, i) => {
        const at = 1.35 + i * 2.4
        timeline.fromTo(caption, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, at)
        if (i < captions.length - 1) timeline.to(caption, { autoAlpha: 0, y: -22, duration: 0.4, ease: 'power2.in' }, at + 2.0)
      })

      timeline
        .fromTo(state, { light: 0 }, { light: 1, duration: 1.6, ease: 'power1.inOut' }, 7.6)
        .to(q('[data-clear-progress]'), { autoAlpha: 0, y: -28, duration: 0.45, ease: 'power2.in' }, 8.6)

      // Un tween par élément (pas de `stagger`) : chaque état de départ est posé dès la construction.
      q('[data-cleared] [data-reveal]').forEach((element, i) => {
        timeline.fromTo(element, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 8.95 + i * 0.14)
      })

      // Tenue : la pièce vide reste un instant à l'écran avant la suite
      timeline.to({}, { duration: 0.5 })

      return () => gsap.set(state, { focus: 0, clear: 0, light: 0 })
    },
    // Mode statique : la 3D reste sur la pièce pleine du hero.
    still: () => {
      gsap.set(progress.current, { focus: 0, clear: 0, light: 0 })
    },
  })
}
