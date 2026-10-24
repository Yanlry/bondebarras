import type { MetaFunction } from 'react-router'
import { pageMeta } from '../lib/seo'
import { EntreprisePage } from '../pages/EntreprisePage'

export const meta: MetaFunction = () => pageMeta('entreprise')

export default function Route() {
  return <EntreprisePage />
}
