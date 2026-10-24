import { useEffect, useState, type RefObject } from 'react'
import { intro } from '../lib/intro'
import { clamp } from '../lib/math'

/** Durée minimale (ms) : le temps de voir le carton se faire scotcher. */
const MIN_DURATION = 1500
/** Au-delà (ms), on lève l'écran même si la 3D n'est pas prête (les images de secours prennent le relais). */
const MAX_WAIT = 5000
/** Pause (ms) entre le tampon et la levée de la porte. */
const STAMP_HOLD = 420
/** Part du scotch posée sur le dessus du carton (le reste descend sur la face). */
const TOP_SHARE = 0.55

/** Touches qui feraient défiler la page sous l'écran de chargement. */
const SCROLL_KEYS = new Set([' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'])

/** Phase de l'écran de chargement. */
export type PreloaderPhase = 'loading' | 'leaving' | 'done'

/** Éléments du DOM pilotés directement (aucun re-rendu React par frame). */
export interface PreloaderRefs {
  root: RefObject<HTMLDivElement | null>
  tapeTop: RefObject<HTMLSpanElement | null>
  tapeSide: RefObject<HTMLSpanElement | null>
  percent: RefObject<HTMLSpanElement | null>
  caption: RefObject<HTMLParagraphElement | null>
}

/**
 * Logique de l'écran de chargement, reliée au **vrai** chargement :
 * 15 % dès que la page est là, 50 % quand les polices sont prêtes, 100 % à la
 * première image de la 3D du hero (ou sans WebGL), avec une durée minimale et
 * un délai maximal. Le scotch se déroule sur le carton au même rythme ; à
 * 100 %, le tampon se pose, puis la porte se lève et l'intro du hero démarre.
 *
 * Tant qu'il est affiché : le reste du site est `inert` et ne défile pas.
 * Avec `prefers-reduced-motion` : pas de durée minimale, simple fondu.
 */
export function usePreloader(refs: PreloaderRefs): [PreloaderPhase, (phase: PreloaderPhase) => void] {
  const [phase, setPhase] = useState<PreloaderPhase>('loading')
  const { root, tapeTop, tapeSide, percent, caption } = refs

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const begin = performance.now()
    let target = 0.15
    let shown = 0
    let frame = 0
    let hold = 0

    const complete = () => {
      target = 1
    }
    if ('fonts' in document) void document.fonts.ready.then(() => (target = Math.max(target, 0.5)))
    if (intro.isSceneReady()) complete()
    const unsubscribe = intro.subscribe(() => {
      if (intro.isSceneReady()) complete()
    })
    const timeout = window.setTimeout(complete, MAX_WAIT)

    const paint = (value: number) => {
      const top = clamp(value / TOP_SHARE)
      const side = clamp((value - TOP_SHARE) / (1 - TOP_SHARE))
      if (tapeTop.current) tapeTop.current.style.transform = `rotate(26.565deg) scaleX(${top.toFixed(4)})`
      if (tapeSide.current) tapeSide.current.style.transform = `skewY(-26.565deg) scaleY(${side.toFixed(4)})`
      if (percent.current) percent.current.textContent = String(Math.round(value * 100))
    }

    const tick = (now: number) => {
      const goal = Math.min(target, reduced ? 1 : clamp((now - begin) / MIN_DURATION))
      shown = reduced ? goal : shown + (goal - shown) * 0.12
      if (goal === 1 && shown > 0.995) shown = 1
      paint(shown)
      if (shown < 1) {
        frame = requestAnimationFrame(tick)
        return
      }
      if (root.current) root.current.dataset.stamped = 'true'
      if (caption.current) caption.current.textContent = 'C’est prêt !'
      hold = window.setTimeout(
        () => {
          intro.start()
          setPhase('leaving')
        },
        reduced ? 0 : STAMP_HOLD,
      )
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
      window.clearTimeout(hold)
      unsubscribe()
    }
  }, [root, tapeTop, tapeSide, percent, caption])

  // Le site caché derrière n'est pas atteignable au clavier (ni lu) tant que l'écran est là.
  useEffect(() => {
    if (phase !== 'loading') return
    const self = root.current
    const siblings = [...(self?.parentElement?.children ?? [])].filter(
      (element): element is HTMLElement => element !== self && element instanceof HTMLElement,
    )
    for (const element of siblings) element.inert = true
    return () => {
      for (const element of siblings) element.inert = false
    }
  }, [phase, root])

  // Pas de défilement sous l'écran de chargement.
  useEffect(() => {
    if (phase !== 'loading') return
    const block = (event: Event) => event.preventDefault()
    const blockKeys = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) event.preventDefault()
    }
    window.addEventListener('wheel', block, { passive: false })
    window.addEventListener('touchmove', block, { passive: false })
    window.addEventListener('keydown', blockKeys)
    return () => {
      window.removeEventListener('wheel', block)
      window.removeEventListener('touchmove', block)
      window.removeEventListener('keydown', blockKeys)
    }
  }, [phase])

  // Filet de sécurité si la fin de transition n'arrive jamais (onglet en arrière-plan…).
  useEffect(() => {
    if (phase !== 'leaving') return
    const timer = window.setTimeout(() => setPhase('done'), 1700)
    return () => window.clearTimeout(timer)
  }, [phase])

  return [phase, setPhase]
}
