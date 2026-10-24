import type { ServicePage } from '../../types/service'

/** Props de {@link ServicePageCard}. */
export interface ServicePageCardProps {
  page: ServicePage
  /** Titre de carte au niveau voulu dans la hiérarchie de la page. */
  headingLevel?: 'h2' | 'h3'
}
