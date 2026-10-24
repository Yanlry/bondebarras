import type { Vec3 } from './geometry'
import type { ServicePageId } from './service'

/**
 * Une situation de la scène 2 « Vous vous reconnaissez ? » : une étiquette
 * kraft accrochée à un objet de la pièce, qui mène à la prestation concernée.
 */
export interface Situation {
  id: string
  /** Texte complet (desktop, légende, version statique). */
  label: string
  /** Texte court (étiquette sur mobile). */
  short: string
  /** Page de prestation correspondante. */
  page: ServicePageId
  /** Objets qui reviennent à leur place quand l'étiquette apparaît (ids de `data/room.ts`). */
  items: readonly string[]
  /** Point d'accroche dans le repère de la pièce (m) : le haut de l'objet revenu. */
  anchor: Vec3
  /** Côté vers lequel l'étiquette s'étend depuis son point d'accroche (desktop). */
  side: 'left' | 'right'
  /** Même chose sur mobile (la pièce occupe toute la largeur : l'étiquette ne doit pas sortir de l'écran). */
  mobileSide: 'left' | 'right'
  /** Longueur de la ficelle sur desktop (px) : étage les étiquettes voisines pour qu'elles ne se chevauchent pas. */
  string: number
}
