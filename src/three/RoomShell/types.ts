import type { RefObject } from 'react'
import type { RoomProgress } from '../../types/room'

/** Props de {@link RoomShell}. */
export interface RoomShellProps {
  /** Avancement de la scène (lu à chaque frame : la pièce s'éclaircit). */
  progress: RefObject<RoomProgress>
  /** Petit écran : texture du parquet plus légère. */
  compact: boolean
}
