import { useRef } from 'react'
import { usePreloader } from '../../hooks/usePreloader'
import { CartonArt } from '../CartonArt'

/**
 * Écran de chargement de la marque : une porte de garage à lames (bleu de
 * travail), un carton que le scotch referme au rythme du vrai chargement, le
 * tampon « Bon Débarras », puis la porte se lève sur la pièce encombrée.
 *
 * Mêmes classes et même dessin que la copie statique d'`index.html` : la
 * relève par React est invisible. Toute la logique est dans `usePreloader`.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const tapeTop = useRef<HTMLSpanElement>(null)
  const tapeSide = useRef<HTMLSpanElement>(null)
  const percent = useRef<HTMLSpanElement>(null)
  const caption = useRef<HTMLParagraphElement>(null)
  const [phase, setPhase] = usePreloader({ root, tapeTop, tapeSide, percent, caption })

  if (phase === 'done') return null

  return (
    <div
      ref={root}
      role="status"
      aria-live="polite"
      data-leaving={phase === 'leaving'}
      onTransitionEnd={(event) => {
        if (event.target === event.currentTarget) setPhase('done')
      }}
      className="splash"
    >
      <span className="sr-only">{phase === 'loading' ? 'Chargement de Bon Débarras…' : 'C’est prêt !'}</span>

      <div aria-hidden="true" className="splash__column">
        <p className="splash__brand">Bon Débarras</p>
        <div className="splash__box">
          <CartonArt />
          <span ref={tapeTop} className="splash__tape splash__tape--top" />
          <span ref={tapeSide} className="splash__tape splash__tape--side" />
          <span className="splash__stamp">BON DÉBARRAS</span>
        </div>
        <p className="splash__percent">
          <span ref={percent}>0</span> %
        </p>
        <p ref={caption} className="splash__caption">
          On prépare les cartons…
        </p>
      </div>
    </div>
  )
}
