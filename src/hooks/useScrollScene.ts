import type { RefObject } from 'react'
import { gsap, SCROLL_SCENE_QUERY, STATIC_SCENE_QUERY, useGSAP } from '../lib/gsap'

/** Nettoyage optionnel renvoyé par une construction de scène. */
type Cleanup = void | (() => void)

/** Options de {@link useScrollScene}. */
export interface ScrollSceneOptions {
  /** Conteneur épinglé : sa traversée complète = progression de 0 à 1. */
  trigger: RefObject<HTMLElement | null>
  /** Lissage du scrub, en secondes. */
  scrub?: number
  /** Easing par défaut des tweens de la timeline. */
  ease?: string
  /** Construit la timeline (mode animé). Peut renvoyer un nettoyage. */
  animate: (timeline: gsap.core.Timeline) => Cleanup
  /** Mode statique (`prefers-reduced-motion`, écran trop bas) : affiche l'état final. */
  still?: () => Cleanup
  /**
   * `false` : la scène reste statique quel que soit l'écran (ex. 3D indisponible).
   * Doit suivre l'attribut `data-scene` de la section (variante CSS `scene:`).
   */
  enabled?: boolean
  /** Reconstruit la scène quand ces valeurs changent (format attendu par useGSAP). */
  dependencies?: unknown[]
}

/**
 * Socle commun des « scènes au scroll » : une timeline GSAP scrubbée sur la
 * traversée d'un conteneur épinglé (CSS sticky), et un mode statique pour qui
 * préfère moins d'animations.
 *
 * `gsap.matchMedia` bascule d'un mode à l'autre en direct (réglage système,
 * rotation d'écran) et `useGSAP` nettoie tout au démontage. Le DOM est écrit
 * dans son état statique : la timeline en part (fromTo / set) et y revient.
 */
export function useScrollScene({
  trigger,
  scrub = 0.7,
  ease = 'none',
  animate,
  still,
  enabled = true,
  dependencies = [],
}: ScrollSceneOptions): void {
  useGSAP(
    () => {
      if (!enabled) return still?.()
      const media = gsap.matchMedia()

      media.add(SCROLL_SCENE_QUERY, () =>
        animate(
          gsap.timeline({
            defaults: { ease },
            scrollTrigger: {
              trigger: trigger.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub,
              invalidateOnRefresh: true,
            },
          }),
        ),
      )

      if (still) media.add(STATIC_SCENE_QUERY, still)
    },
    { scope: trigger, dependencies: [enabled, ...dependencies], revertOnUpdate: true },
  )
}
