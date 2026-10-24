import type { MetaFunction } from 'react-router'
import { pageMeta } from '../lib/seo'
import { NotFoundPage } from '../pages/NotFoundPage'

export const meta: MetaFunction = () => pageMeta('introuvable')

export default function Route() {
  return <NotFoundPage />
}
