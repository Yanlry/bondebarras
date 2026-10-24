import { useLocation, type MetaFunction } from 'react-router'
import { company } from '../data/company'
import { findPageByPath } from '../data/pages'
import { getServicePage, servicePages } from '../data/services'
import { pageMeta } from '../lib/seo'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ServicePageView } from '../pages/ServicePageView'
import type { ServicePageId } from '../types/service'

const serviceIds = new Set<string>(servicePages.map((page) => page.id))

/** Prestation correspondant au chemin (`/prestations/<id>`). */
function serviceFromPath(pathname: string): ServicePageId | null {
  const page = findPageByPath(pathname)
  return page && serviceIds.has(page.id) ? (page.id as ServicePageId) : null
}

export const meta: MetaFunction = ({ location }) => {
  const id = serviceFromPath(location.pathname)
  if (!id) return pageMeta('introuvable')
  const service = getServicePage(id)
  return pageMeta(id, [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.h1,
      serviceType: service.navLabel,
      description: findPageByPath(location.pathname)?.description,
      provider: { '@type': 'Organization', name: company.name, telephone: company.phone.value.href.replace('tel:', '') },
    },
  ])
}

/** Les 7 pages de prestation partagent ce module ; le contenu dépend du chemin. */
export default function ServiceRoute() {
  const { pathname } = useLocation()
  const id = serviceFromPath(pathname)
  return id ? <ServicePageView id={id} /> : <NotFoundPage />
}
