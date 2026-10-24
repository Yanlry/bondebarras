import type { ServiceIcon } from '../../types/service'

/** Nom d'une icône du jeu de la marque. */
export type IconName =
  | 'phone'
  | 'arrow'
  | 'arrow-down'
  | 'box'
  | 'check'
  | 'mail'
  | 'pin'
  | 'clock'
  | 'menu'
  | 'close'
  | 'chevron-down'
  | ServiceIcon

/** Props de {@link Icon}. */
export interface IconProps {
  name: IconName
  className?: string
}
