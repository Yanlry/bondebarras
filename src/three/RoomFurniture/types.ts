import type { RefObject } from 'react'
import type { PointerState } from '../../hooks/usePointerRef'
import type { ItemPlan } from '../../lib/roomMotion'
import type { RoomProgress } from '../../types/room'

/** Props de {@link RoomFurniture}. */
export interface RoomFurnitureProps {
  plans: readonly ItemPlan[]
  progress: RefObject<RoomProgress>
  /** Lance l'intro : les objets tombent dans la pièce. */
  play: boolean
  /** `prefers-reduced-motion` : objets directement à leur place, pas de survol. */
  still: boolean
  pointer: RefObject<PointerState>
  /** Souris disponible : l'objet survolé se soulève. */
  interactive: boolean
  /** Finesse des formes rondes (1 = desktop). */
  detail: number
}
