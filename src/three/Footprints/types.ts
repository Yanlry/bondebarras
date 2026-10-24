import type { RefObject } from 'react'
import type { ItemPlan } from '../../lib/roomMotion'
import type { RoomProgress } from '../../types/room'

/** Props de {@link Footprints}. */
export interface FootprintsProps {
  plans: readonly ItemPlan[]
  progress: RefObject<RoomProgress>
}
