import type { RefObject } from 'react'
import type { RoomProgress } from '../../types/room'

/** Props de {@link SunBeam}. */
export interface SunBeamProps {
  progress: RefObject<RoomProgress>
}
