import type { ReactNode } from 'react'

/** Props de {@link ErrorBoundary}. */
export interface ErrorBoundaryProps {
  children: ReactNode
  /** Rendu de secours si le sous-arbre plante. */
  fallback: ReactNode
  /** Appelé une fois, quand le sous-arbre plante. */
  onError?: () => void
}

/** État interne de {@link ErrorBoundary}. */
export interface ErrorBoundaryState {
  hasError: boolean
}
