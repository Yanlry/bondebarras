/** Props de {@link BrandTitle}. */
export interface BrandTitleProps {
  /** Texte du titre (la lettre `é` reçoit l'accent-flèche). */
  text?: string
  /** Lance l'arrivée des lettres (une fois l'écran de chargement levé). */
  play: boolean
  className?: string
}
