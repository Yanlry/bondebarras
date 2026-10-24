import { useRef } from 'react'
import { useCursor } from '../../hooks/useCursor'
import { useMediaQuery } from '../../hooks/useMediaQuery'

/**
 * Curseur personnalisé (desktop avec souris uniquement) : un cercle en
 * pointillés, l'empreinte de la marque. Logique dans `useCursor`.
 */
export function TraceCursor() {
  const root = useRef<HTMLDivElement>(null)
  const enabled = useMediaQuery('(hover: hover) and (pointer: fine)')
  useCursor(root, enabled)

  if (!enabled) return null
  return (
    <div ref={root} aria-hidden="true" className="trace-cursor" data-visible="false" data-state="idle">
      <span className="trace-cursor__ring" />
      <span className="trace-cursor__dot" />
    </div>
  )
}
