import type { MetaFunction } from 'react-router'
import { pageMeta } from '../lib/seo'
import { PrivacyPage } from '../pages/PrivacyPage'

export const meta: MetaFunction = () => pageMeta('confidentialite')

export default function Route() {
  return <PrivacyPage />
}
