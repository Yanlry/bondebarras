import type { RefObject } from 'react'
import { gsap } from '../lib/gsap'
import { situations } from '../data/situations'
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
  /** Petit écran : les étiquettes de la scène 2 se relaient au lieu de s'accumuler. */
  compact: boolean
}

/** Repères de la timeline (unités arbitraires, ≈ 17,7 au total). */
const T = {
  /** Débarras : les objets sortent, les trois prestations principales se relaient. */
  clear: 1.5,
  clearDuration: 7.2,
  captionsGap: 2.4,
  /** « Vous vous reconnaissez ? » : légende, une étiquette toutes les 0,5 unité, tenue pour lire et cliquer. */
  situations: 8.95,
  firstTag: 9.2,
  tagGap: 0.7,
  tagsOut: 13.8,
  /** Les objets revenus ressortent, puis la lumière et « Bon débarras. ». */
  release: 13.95,
  light: 14.9,
  cleared: 16.25,
} as const

/**
 * Accueil, scrubbé sur le scroll d'une seule section épinglée :
 *
 * - 0 → 1,5 : le texte du hero s'efface, la pièce glisse vers le centre (`focus`) ;
 * - 1,5 → 8,7 : les objets quittent la pièce un à un (`clear`) en laissant leur
 *   empreinte ; la jauge se remplit ; « Pour votre maison. / Pour vos proches. /
 *   Pour votre entreprise. » se relaient (avec un lien vers chaque page) ;
 * - 8,95 → 14,4 : « Vous vous reconnaissez ? » — pour chaque situation, ses objets
 *   repassent la porte et reprennent leur place (`recall`), puis l'étiquette s'y
 *   accroche (sur desktop elles s'accumulent, sur mobile elles se relaient) ; la
 *   légende s'allume ligne à ligne ; tenue, décrochage, et les objets ressortent ;
 * - 14,9 → 16,5 : la lumière revient (`light`), empreintes et poussière s'effacent ;
 * - 16,25 → 17,7 : « Bon débarras. » et l'appel au devis.
 *
 * Le DOM est écrit dans son état statique : la timeline en part par des
 * `fromTo` (un tween par élément, jamais de `stagger` scrubbé) et y revient en
 * remontant. En mode statique, la 3D reste sur la pièce pleine du hero.
 */
export function useRoomScene({ trigger, progress, enabled, compact }: RoomSceneOptions): void {
  useScrollScene({
    trigger,
    enabled,
    dependencies: [compact],
    animate: (timeline) => {
      const q = gsap.utils.selector(trigger)
      const state = progress.current

      // — Cadrage —
      timeline
        .fromTo(q('[data-hero-copy]'), { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -56, duration: 1, ease: 'power2.in' }, 0)
        .fromTo(q('[data-scroll-cue]'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.4 }, 0)
        .fromTo(state, { focus: 0 }, { focus: 1, duration: 1.5, ease: 'power2.inOut' }, 0.05)

      // — Débarras : les trois prestations principales —
      const captions = q('[data-clear-caption]')
      timeline
        .fromTo(q('[data-clear-progress]'), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, T.clear - 0.2)
        .fromTo(state, { clear: 0 }, { clear: 1, duration: T.clearDuration }, T.clear)
        .fromTo(q('[data-gauge-fill]'), { scaleX: 0 }, { scaleX: 1, duration: T.clearDuration }, T.clear)
      captions.forEach((caption, i) => {
        const at = T.clear + 0.05 + i * T.captionsGap
        timeline.fromTo(caption, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, at)
        if (i < captions.length - 1) timeline.to(caption, { autoAlpha: 0, y: -22, duration: 0.4, ease: 'power2.in' }, at + 2.0)
      })
      timeline.to(q('[data-clear-progress]'), { autoAlpha: 0, y: -28, duration: 0.45, ease: 'power2.in' }, T.situations - 0.35)

      // — « Vous vous reconnaissez ? » : étiquettes épinglées sur les empreintes —
      timeline.fromTo(q('[data-situations]'), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, T.situations)
      const tags = q('[data-situation-tag]')
      const strings = q('[data-situation-string]')
      const legendItems = q('[data-situation-item]')
      const recalled = situations.flatMap((situation) => situation.items)
      gsap.set(state.recall, Object.fromEntries(recalled.map((id) => [id, 0])))
      tags.forEach((tag, i) => {
        const at = T.firstTag + i * T.tagGap
        // Les objets de la situation repassent la porte et reprennent leur place, puis l'étiquette s'y accroche
        const items = situations[i]?.items ?? []
        if (items.length)
          timeline.fromTo(
            state.recall,
            Object.fromEntries(items.map((id) => [id, 0])),
            { ...Object.fromEntries(items.map((id) => [id, 1])), duration: 0.5, ease: 'power1.inOut' },
            at - 0.2,
          )
        const string = strings[i]
        if (string) timeline.fromTo(string, { scaleY: 0 }, { scaleY: 1, duration: 0.22, ease: 'power2.out' }, at + 0.3)
        timeline.fromTo(
          tag,
          { autoAlpha: 0, y: 16, rotate: i % 2 ? 5 : -5 },
          { autoAlpha: 1, y: 0, rotate: 0, duration: 0.42, ease: 'back.out(1.6)' },
          at + 0.38,
        )
        const legendItem = legendItems[i]
        if (legendItem) timeline.fromTo(legendItem, { autoAlpha: 0.32 }, { autoAlpha: 1, duration: 0.3 }, at + 0.38)
        // Mobile : une étiquette à la fois, la précédente se décroche
        if (compact && i < tags.length - 1) timeline.to(tag, { autoAlpha: 0, y: -12, duration: 0.25, ease: 'power2.in' }, at + T.tagGap + 0.1)
      })
      timeline
        .to(tags, { autoAlpha: 0, y: -22, duration: 0.35, ease: 'power2.in' }, T.tagsOut)
        .to(q('[data-situations]'), { autoAlpha: 0, y: -28, duration: 0.4, ease: 'power2.in' }, T.tagsOut)
      // Les objets revenus ressortent, l'un après l'autre
      situations.forEach((situation, i) => {
        timeline.to(state.recall, { ...Object.fromEntries(situation.items.map((id) => [id, 0])), duration: 0.45, ease: 'power1.in' }, T.release + i * 0.1)
      })

      // — Lumière, puis « Bon débarras. » —
      timeline.fromTo(state, { light: 0 }, { light: 1, duration: 1.6, ease: 'power1.inOut' }, T.light)
      q('[data-cleared] [data-reveal]').forEach((element, i) => {
        timeline.fromTo(element, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, T.cleared + i * 0.14)
      })

      // Tenue : la pièce vide reste un instant à l'écran avant la suite
      timeline.to({}, { duration: 0.5 })

      return () => {
        gsap.set(state, { focus: 0, clear: 0, light: 0 })
        gsap.set(state.recall, Object.fromEntries(recalled.map((id) => [id, 0])))
      }
    },
    // Mode statique : la 3D reste sur la pièce pleine du hero.
    still: () => {
      gsap.set(progress.current, { focus: 0, clear: 0, light: 0 })
    },
  })
}
