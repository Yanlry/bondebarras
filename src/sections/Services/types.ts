import type { ServiceCategory, ServiceItem } from '../../types/service'

/** Props d'une carte de famille de prestations. */
export interface ServiceCardProps {
  category: ServiceCategory
}

/** Props d'une ligne de prestation. */
export interface ServiceLineProps {
  item: ServiceItem
}
