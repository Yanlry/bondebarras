import type { SkipLinksProps } from './types'

/**
 * Liens d'évitement : invisibles jusqu'au premier Tab, ils mènent directement
 * au contenu ou au formulaire de devis, sans traverser les scènes animées.
 */
export function SkipLinks({ links }: SkipLinksProps) {
  return (
    <nav aria-label="Accès rapide" className="contents">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="sr-only rounded-full bg-ink px-5 py-3 font-display font-semibold text-air focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[500]"
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}
