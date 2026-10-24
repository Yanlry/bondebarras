/** Nom d'une icône du jeu de la marque. */
export type IconName = 'phone' | 'arrow' | 'arrow-down' | 'box' | 'check' | 'mail' | 'pin' | 'clock'

/** Props de {@link Icon}. */
export interface IconProps {
  name: IconName
  className?: string
}
