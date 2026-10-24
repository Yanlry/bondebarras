import type { MetaFunction } from 'react-router'
import { pageMeta } from '../lib/seo'
import { ContactPage } from '../pages/ContactPage'

export const meta: MetaFunction = () => pageMeta('contact')

export default function Route() {
  return <ContactPage />
}
