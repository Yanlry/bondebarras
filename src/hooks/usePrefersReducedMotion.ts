import { useMediaQuery } from './useMediaQuery'

/**
 * `true` si l'utilisateur a demandé à réduire les animations
 * (réglage système `prefers-reduced-motion: reduce`).
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
