import { Component, type ErrorInfo } from 'react'
import type { ErrorBoundaryProps, ErrorBoundaryState } from './types'

/**
 * Filet de sécurité : si un sous-arbre plante (WebGL indisponible, pilote
 * graphique capricieux…), on affiche le `fallback` au lieu d'une page blanche.
 * La scène 3D est toujours enveloppée dedans.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    if (import.meta.env.DEV) console.warn('[ErrorBoundary] Rendu de secours affiché :', error, info.componentStack)
    this.props.onError?.()
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}
