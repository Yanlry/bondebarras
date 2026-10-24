import { Suspense, lazy, useCallback, useRef } from 'react'
import { usePointerRef } from '../../hooks/usePointerRef'
import { roomImages } from '../../data/room-story'
import type { RoomProgress } from '../../types/room'
import type { RoomCaptureProps } from './types'

const RoomScene = lazy(() => import('../../sections/RoomStory/RoomScene'))

/** Marges autour de la maquette dans l'image (px). */
const MARGIN = 40

/**
 * Développement uniquement (`?capture=avant` ou `?capture=apres`) : la pièce
 * seule, fond transparent, figée dans l'état demandé. Le script
 * `scripts/capture-room.mjs` la photographie pour produire les images de
 * secours (sans WebGL, mode statique) à partir de la vraie 3D.
 */
export default function RoomCapture({ state }: RoomCaptureProps) {
  const done = state === 'apres' ? 1 : 0
  const progress = useRef<RoomProgress>({ focus: 0, clear: done, light: done, recall: {} })
  const pointer = usePointerRef()
  const slot = { x: MARGIN, y: MARGIN, width: roomImages.width - MARGIN * 2, height: roomImages.height - MARGIN * 2 }
  const handleReady = useCallback(() => {
    // Deux frames de plus : ombres et matériaux à jour avant la photo.
    requestAnimationFrame(() => requestAnimationFrame(() => (window.__roomCaptureReady = true)))
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, width: roomImages.width, height: roomImages.height }}>
      <Suspense fallback={null}>
        <RoomScene
          heroSlot={slot}
          focusSlot={slot}
          progress={progress}
          pointer={pointer}
          active
          reducedMotion
          compact={false}
          interactive={false}
          play
          onReady={handleReady}
          preserveDrawingBuffer
        />
      </Suspense>
    </div>
  )
}
