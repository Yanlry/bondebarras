import type { RefObject } from 'react'
import type { RoomProgress } from '../../types/room'

/** Props de {@link DustMotes}. */
export interface DustMotesProps {
  progress: RefObject<RoomProgress>
  /** Nombre de grains (moins sur mobile). */
  count: number
  /** Grains immobiles (`prefers-reduced-motion`). */
  still: boolean
}
