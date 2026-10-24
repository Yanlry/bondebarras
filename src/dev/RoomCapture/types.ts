/** État de la pièce à capturer : pleine (« avant ») ou vide (« après »). */
export type RoomCaptureState = 'avant' | 'apres'

/** Props de {@link RoomCapture}. */
export interface RoomCaptureProps {
  state: RoomCaptureState
}

declare global {
  interface Window {
    /** Posé à la première image rendue : le script de capture peut photographier. */
    __roomCaptureReady?: boolean
  }
}
