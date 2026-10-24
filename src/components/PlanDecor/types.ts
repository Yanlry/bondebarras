/** Une empreinte du plan : position et taille en % du cadre. */
export interface PlanRect {
  x: number
  y: number
  w: number
  h: number
}

/** Composition d'un plan décoratif (propre à chaque page). */
export interface PlanLayout {
  /** Empreintes en pointillés (objets enlevés). */
  footprints: readonly PlanRect[]
  /** Le carton témoin (seul objet restant). */
  carton: PlanRect
  /** Étiquette kraft posée sur le plan. */
  label: string
}

/** Props de {@link PlanDecor}. */
export interface PlanDecorProps {
  layout: PlanLayout
  className?: string
}
