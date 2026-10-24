import { useLayoutEffect, useState, type RefObject } from 'react'
import type { Rect } from '../types/geometry'

/**
 * Mesure la position d'un élément **dans** un conteneur (indépendante du scroll).
 *
 * La scène de la pièce s'en sert pour cadrer la maquette 3D exactement dans
 * l'emplacement prévu par la mise en page CSS (grille responsive).
 */
export function useRelativeRect(targetRef: RefObject<Element | null>, containerRef: RefObject<Element | null>): Rect | null {
  const [rect, setRect] = useState<Rect | null>(null)

  useLayoutEffect(() => {
    const target = targetRef.current
    const container = containerRef.current
    if (!target || !container) return

    const measure = () => {
      const t = target.getBoundingClientRect()
      const c = container.getBoundingClientRect()
      const next = {
        x: Math.round(t.left - c.left),
        y: Math.round(t.top - c.top),
        width: Math.round(t.width),
        height: Math.round(t.height),
      }
      setRect((prev) =>
        prev && prev.x === next.x && prev.y === next.y && prev.width === next.width && prev.height === next.height
          ? prev
          : next,
      )
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(target)
    observer.observe(container)
    return () => observer.disconnect()
  }, [targetRef, containerRef])

  return rect
}
