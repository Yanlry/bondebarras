import { useEffect, type RefObject } from 'react'
import { damp } from '../lib/math'

/** Éléments qui font réagir le curseur (il se remplit). */
const INTERACTIVE = 'a, button, [role="button"], label, summary, [data-cursor="link"]'
/** Champs : curseur texte natif, le cercle s'efface. */
const FIELDS = 'input, textarea, select'

/**
 * Curseur « empreinte » (souris uniquement) : un cercle en pointillés qui suit
 * le pointeur avec un léger retard et se remplit sur les liens. Boucle rAF +
 * refs, aucun re-rendu React ; la boucle s'arrête quand le curseur est immobile.
 *
 * Pas d'état « soulever » au-dessus des objets 3D : tout changement d'aspect du
 * curseur au-dessus de la pièce coûtait une frame de 60 à 90 ms au premier
 * survol (mesuré, cause interne au navigateur). L'objet qui se soulève suffit.
 */
export function useCursor(root: RefObject<HTMLDivElement | null>, enabled: boolean): void {
  useEffect(() => {
    const element = root.current
    if (!enabled || !element) return
    const html = document.documentElement
    html.classList.add('has-trace-cursor')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const target = { x: -100, y: -100 }
    const shown = { x: -100, y: -100 }
    let frame = 0
    let last = 0

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      shown.x = reduced ? target.x : damp(shown.x, target.x, 22, dt)
      shown.y = reduced ? target.y : damp(shown.y, target.y, 22, dt)
      element.style.transform = `translate3d(${shown.x.toFixed(1)}px, ${shown.y.toFixed(1)}px, 0)`
      const settled = Math.abs(shown.x - target.x) < 0.1 && Math.abs(shown.y - target.y) < 0.1
      frame = settled ? 0 : requestAnimationFrame(loop)
    }
    const wake = () => {
      if (frame) return
      last = performance.now()
      frame = requestAnimationFrame(loop)
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      target.x = event.clientX
      target.y = event.clientY
      if (element.dataset.visible !== 'true') element.dataset.visible = 'true'
      const hit = event.target instanceof Element ? event.target : null
      const hidden = String(Boolean(hit?.closest(FIELDS)))
      if (element.dataset.hidden !== hidden) element.dataset.hidden = hidden
      const state = hit?.closest(INTERACTIVE) ? 'link' : 'idle'
      if (element.dataset.state !== state) element.dataset.state = state
      wake()
    }
    const onLeave = () => (element.dataset.visible = 'false')
    const onDown = () => (element.dataset.pressed = 'true')
    const onUp = () => (element.dataset.pressed = 'false')

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    html.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      html.classList.remove('has-trace-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      html.removeEventListener('pointerleave', onLeave)
    }
  }, [root, enabled])
}
