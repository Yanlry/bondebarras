import type { RefObject } from 'react'
import type { PointerState } from '../../hooks/usePointerRef'
import type { Rect } from '../../types/geometry'
import type { RoomProgress } from '../../types/room'

/** Props de la scène 3D de la pièce (chargée à la demande). */
export interface RoomSceneProps {
  /** Emplacement de la pièce dans le hero (px, relatif au canvas). */
  heroSlot: Rect
  /** Emplacement de la pièce pendant le débarras (px, relatif au canvas). */
  focusSlot: Rect
  progress: RefObject<RoomProgress>
  pointer: RefObject<PointerState>
  /** Rendu actif (scène visible à l'écran). */
  active: boolean
  reducedMotion: boolean
  /** Petit écran : scène allégée (moins d'objets, ombres et résolution réduites). */
  compact: boolean
  /** Souris disponible (suivi du curseur, survol des objets). */
  interactive: boolean
  /** Lance l'intro (une fois l'écran de chargement levé). */
  play: boolean
  /** Appelé après la première image rendue. */
  onReady?: () => void
  /** Conserve l'image du canvas (captures des images de secours, en développement). */
  preserveDrawingBuffer?: boolean
}

/** Props du texte du hero. */
export interface HeroCopyProps {
  play: boolean
}
