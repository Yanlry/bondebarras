import type { RefObject } from 'react'
import type { PointerState } from '../../hooks/usePointerRef'
import type { Rect } from '../../types/geometry'
import type { RoomProgress } from '../../types/room'

/** Props de {@link CameraRig}. */
export interface CameraRigProps {
  /** Emplacement de la pièce dans le hero (px, relatif au canvas). */
  heroSlot: Rect
  /** Emplacement de la pièce pendant le débarras (px, relatif au canvas). */
  focusSlot: Rect
  progress: RefObject<RoomProgress>
  pointer: RefObject<PointerState>
  /** Souris disponible : la caméra s'oriente légèrement vers le curseur. */
  interactive: boolean
  /** `prefers-reduced-motion` : caméra fixe. */
  still: boolean
}
