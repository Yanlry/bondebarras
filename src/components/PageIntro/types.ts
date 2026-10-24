import type { ReactNode } from 'react'
import type { PageId } from '../../types/site'
import type { PlanLayout } from '../PlanDecor/types'

/** Props de {@link PageIntro}. */
export interface PageIntroProps {
  page: PageId
  /** Étiquette kraft au-dessus du titre. */
  tag: string
  /** H1 de la page. */
  title: string
  lede: string
  /** Boutons d'action (devis, appel). */
  actions?: ReactNode
  /** Plan décoratif ; sans lui, l'introduction est seulement typographique. */
  plan?: PlanLayout
  /** Ton sobre (succession, Diogène) : moins de contraste, aucun orange décoratif. */
  sober?: boolean
}
