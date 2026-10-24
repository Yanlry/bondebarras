import type { MetaFunction } from 'react-router'
import { pageMeta } from '../lib/seo'
import { DevisPage } from '../pages/DevisPage'

export const meta: MetaFunction = () => pageMeta('devis')

export default function Route() {
  return <DevisPage />
}
