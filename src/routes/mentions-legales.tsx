import type { MetaFunction } from 'react-router'
import { pageMeta } from '../lib/seo'
import { LegalNoticePage } from '../pages/LegalNoticePage'

export const meta: MetaFunction = () => pageMeta('mentions-legales')

export default function Route() {
  return <LegalNoticePage />
}
