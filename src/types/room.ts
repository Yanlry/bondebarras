import type { FloorPoint, Vec3 } from './geometry'

/** Pavé arrondi : `size` = largeur (x), hauteur (y), profondeur (z). */
interface BoxPart {
  shape: 'box'
  size: Vec3
  /** Rayon des arêtes (aspect « maquette en argile »). */
  radius?: number
}

/** Cylindre ou tronc de cône (abat-jour, pot), axe vertical avant rotation. */
interface CylinderPart {
  shape: 'cylinder'
  radius: number
  radiusTop?: number
  height: number
}

/** Sphère, éventuellement écrasée (sacs, feuillage). */
interface SpherePart {
  shape: 'sphere'
  radius: number
  scale?: Vec3
}

/** Une pièce d'un objet, dans le repère local de l'objet (origine : centre de sa base). */
export type RoomPart = (BoxPart | CylinderPart | SpherePart) & {
  position: Vec3
  rotation?: Vec3
  /** Couleur sRGB (hex). */
  color: string
}

/**
 * Famille d'objet, qui détermine la façon dont il quitte la pièce :
 * - `furniture` : meuble porté bas, incliné sur un coin comme par des déménageurs ;
 * - `box` : carton soulevé et transporté en arc ;
 * - `small` : petit objet, plus haut et plus vite.
 */
export type RoomItemKind = 'furniture' | 'box' | 'small'

/** Un objet de la pièce encombrée. */
export interface RoomItem {
  id: string
  /** Nom lisible (liste `sr-only`, débogage). */
  label: string
  kind: RoomItemKind
  /** Position au sol de la base de l'objet. */
  position: FloorPoint
  /** Hauteur de la base (objet posé sur un autre), 0 au sol. */
  baseY: number
  /** Orientation autour de l'axe vertical (radians). */
  yaw: number
  /** Emprise au sol (largeur x, profondeur z) : son empreinte en pointillés. `null` si posé sur un autre objet. */
  footprint: FloorPoint | null
  /** Rang de départ (1 = premier à quitter la pièce). */
  order: number
  /** Absent sur petit écran (scène allégée). */
  desktopOnly?: boolean
  /** Le carton témoin : il reste dans la pièce vide et accompagne le visiteur. */
  witness?: boolean
  parts: readonly RoomPart[]
}

/**
 * Avancement de la scène de la pièce, écrit par la timeline GSAP (scroll)
 * et lu à chaque frame par la 3D. Chaque valeur va de 0 à 1.
 */
export interface RoomProgress {
  /** Cadrage : de l'emplacement du hero au plein écran. */
  focus: number
  /** Débarras : les objets quittent la pièce un à un. */
  clear: number
  /** Lumière : poussière dissipée, sol et rayon de soleil éclaircis. */
  light: number
}
