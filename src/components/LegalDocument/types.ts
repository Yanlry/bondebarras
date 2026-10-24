import type { ReactNode } from 'react'
import type { PageId } from '../../types/site'

/** Props de {@link LegalDocument}. */
export interface LegalDocumentProps {
  page: PageId
  title: string
  children: ReactNode
}
