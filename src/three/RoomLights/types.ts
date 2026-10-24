import type { RefObject } from 'react'
import type { RoomProgress } from '../../types/room'

/** Props de {@link RoomLights}. */
export interface RoomLightsProps {
  progress: RefObject<RoomProgress>
  /** Taille de la carte d'ombre (px). */
  shadowSize: number
}
