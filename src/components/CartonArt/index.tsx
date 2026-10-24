import type { CartonArtProps } from './types'

/**
 * Carton kraft fermé, en vue isométrique (repère 200 × 170), dessiné une fois
 * et jamais animé de l'intérieur : le scotch et le tampon sont des calques
 * HTML posés par-dessus dans le même repère (aucun repaint du SVG).
 * La copie statique d'`index.html` reproduit exactement ce dessin.
 */
export function CartonArt({ className }: CartonArtProps) {
  return (
    <svg viewBox="0 0 200 170" aria-hidden="true" focusable="false" className={className}>
      <ellipse cx="100" cy="132" rx="90" ry="42" fill="#0f1f4d" opacity="0.28" />
      <path d="M24 56 100 94v70l-76-38Z" fill="#c9a27c" />
      <path d="m100 94 76-38v70l-76 38Z" fill="#a9825c" />
      <path d="m100 18 76 38-76 38-76-38Z" fill="#dcbb94" />
      <path d="m62 37 76 38" stroke="#a9825c" strokeWidth="1.5" />
      <path d="M100 94v70" stroke="#8f6c4a" strokeWidth="1.2" opacity="0.6" />
    </svg>
  )
}
