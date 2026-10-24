/** Rectangle en px, relatif au coin haut-gauche d'un conteneur. */
export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/** Vecteur 3D en lecture seule (repère de la pièce, en mètres). */
export type Vec3 = readonly [number, number, number]

/** Position au sol (x, z) dans le repère de la pièce, en mètres. */
export type FloorPoint = readonly [number, number]
