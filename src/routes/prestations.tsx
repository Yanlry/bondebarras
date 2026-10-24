import type { MetaFunction } from 'react-router'
import { pageMeta } from '../lib/seo'
import { PrestationsPage } from '../pages/PrestationsPage'

export const meta: MetaFunction = () => pageMeta('prestations')

export default function Route() {
  return <PrestationsPage />
}
