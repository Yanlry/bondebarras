import { useEffect, useRef } from 'react'
import { pageTransition } from '../../lib/pageTransition'

/**
 * Bande de scotch kraft et orange qui balaie l'écran entre deux pages
 * (pilotée par `lib/pageTransition`). Décorative, sans interaction.
 */
export function PageTransition() {
  const band = useRef<HTMLDivElement>(null)
  useEffect(() => (band.current ? pageTransition.attach(band.current) : undefined), [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[450] overflow-hidden">
      <div ref={band} className="page-tape" style={{ visibility: 'hidden', transform: 'translate3d(-115%, 0, 0)' }}>
        <span className="page-tape__sangle" />
      </div>
    </div>
  )
}
