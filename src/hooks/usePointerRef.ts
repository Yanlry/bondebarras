import { useEffect, useRef, type RefObject } from 'react'

/** Dernière position connue du pointeur, en px fenêtre, et compteur de mouvements. */
export interface PointerState {
  /** Position normalisée sur la fenêtre, x et y ∈ [-1, 1] (y vers le haut). */
  x: number
  y: number
  /** Position en px dans la fenêtre. */
  clientX: number
  clientY: number
  /** Incrémenté à chaque mouvement : permet de ne refaire un calcul que si le pointeur a bougé. */
  version: number
  /** Le pointeur est au-dessus de la fenêtre (souris). */
  inside: boolean
}

/**
 * Suit le pointeur sur **toute la fenêtre**, sans aucun re-rendu React :
 * la scène 3D lit la ref à chaque frame. Contrairement au pointeur de R3F,
 * le suivi continue quand la souris passe au-dessus du texte posé sur le canvas.
 */
export function usePointerRef(): RefObject<PointerState> {
  const pointer = useRef<PointerState>({ x: 0, y: 0, clientX: -1, clientY: -1, version: 0, inside: false })

  useEffect(() => {
    const state = pointer.current
    const onPointerMove = (event: PointerEvent) => {
      state.clientX = event.clientX
      state.clientY = event.clientY
      state.x = (event.clientX / window.innerWidth) * 2 - 1
      state.y = 1 - (event.clientY / window.innerHeight) * 2
      state.inside = event.pointerType === 'mouse'
      state.version++
    }
    const onLeave = () => {
      state.inside = false
      state.version++
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return pointer
}
