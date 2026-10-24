/**
 * L'accent du « é » de Débarras : une flèche de sortie ↗, signature de la
 * marque (ce qui encombre sort de la pièce).
 */
export function AccentArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" className={className}>
      <path d="M5 19 18 6M8.5 5.5H18.5V15.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
