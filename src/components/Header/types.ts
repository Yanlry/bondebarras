/** Props de {@link Header}. */
export interface HeaderProps {
  /** Apparition terminée (après l'écran de chargement). */
  play: boolean
  /** Entrée animée (seulement quand la visite commence par l'accueil et son écran de chargement). */
  animateIn: boolean
}

/** Props du menu Prestations (desktop). */
export interface PrestationsMenuProps {
  /** Page de prestation courante, pour `aria-current`. */
  pathname: string
}

/** Props du menu mobile. */
export interface MobileMenuProps {
  open: boolean
  onClose: () => void
}
