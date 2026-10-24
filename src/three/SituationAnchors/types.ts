import type { RefObject } from 'react'
import type { RoomProgress } from '../../types/room'
import type { Situation } from '../../types/situation'

/** Props de {@link SituationAnchors}. */
export interface SituationAnchorsProps {
  situations: readonly Situation[]
  /** Calques HTML des étiquettes (même ordre que `situations`), positionnés ici à chaque frame. */
  targets: RefObject<Array<HTMLElement | null>>
  progress: RefObject<RoomProgress>
}
