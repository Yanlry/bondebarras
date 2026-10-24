import { forwardRef, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { isInternalHref, normalizePath } from '../../lib/links'
import { pageTransition } from '../../lib/pageTransition'
import type { SmartLinkProps } from './types'

/**
 * Lien unique du site :
 * - chemin interne → lien React Router, page préchargée au survol, transition
 *   « scotch » avant le changement de page, `aria-current="page"` sur la page courante ;
 * - ancre, `tel:`, lien externe → simple <a>.
 * Ctrl / Cmd + clic, clic du milieu et `target` gardent leur comportement natif.
 */
export const SmartLink = forwardRef<HTMLAnchorElement, SmartLinkProps>(function SmartLink({ href, onClick, target, children, ...props }, ref) {
  const navigate = useNavigate()
  const location = useLocation()

  if (!isInternalHref(href)) {
    return (
      <a ref={ref} href={href} target={target} onClick={onClick} {...props}>
        {children}
      </a>
    )
  }

  const path = href.split(/[?#]/)[0] ?? href
  const isCurrent = normalizePath(location.pathname) === path

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || target) return
    event.preventDefault()
    if (href === normalizePath(location.pathname) + location.search) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    void pageTransition.cover().then(() => navigate(href))
  }

  return (
    <Link ref={ref} to={href} prefetch="intent" aria-current={isCurrent && !href.includes('?') ? 'page' : undefined} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
})
