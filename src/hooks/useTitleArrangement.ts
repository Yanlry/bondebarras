import { useMemo } from 'react'
import { seededRandom } from '../lib/math'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/** Une lettre du titre et sa position de départ « en vrac ». */
export interface ArrangedLetter {
  char: string
  /** Index de la lettre dans le titre (espaces exclus). */
  index: number
  /** Décalage de départ (em) et rotation (degrés) : lettres entassées comme dans une pièce pleine. */
  from: { x: string; y: string; rotate: number }
  /** Délai avant d'être « portée » à sa place (s). */
  delay: number
  /** Le « e » qui porte l'accent-flèche. */
  accent: boolean
}

/** Un mot du titre (jamais coupé en fin de ligne). */
export interface ArrangedWord {
  letters: ArrangedLetter[]
}

/** Résultat de {@link useTitleArrangement}. */
export interface TitleArrangement {
  words: ArrangedWord[]
  /** Délai de l'arrivée de l'accent-flèche, en dernier. */
  accentDelay: number
  /** Animation coupée (`prefers-reduced-motion`) : les lettres sont directement rangées. */
  still: boolean
}

/** Écart entre deux lettres portées à leur place (s). */
const STAGGER = 0.055

/**
 * Signature typographique « le titre qui se range » : les lettres arrivent
 * en vrac, entassées et penchées au bout du mot comme les objets d'une pièce
 * encombrée, puis sont portées une à une à leur place (dépilage depuis le
 * haut du tas). L'accent du « é » s'envole et revient en flèche ↗.
 *
 * Positions pseudo-aléatoires mais déterministes (mêmes à chaque visite),
 * exprimées en `em` pour suivre la taille du titre. Transform et opacité seuls.
 *
 * @param text Titre (la lettre `é` reçoit l'accent-flèche).
 * @param seed Graine du tirage.
 */
export function useTitleArrangement(text: string, seed = 7): TitleArrangement {
  const still = usePrefersReducedMotion()

  return useMemo(() => {
    const random = seededRandom(seed)
    const total = text.replace(/\s/g, '').length
    let index = 0
    const words = text.split(' ').map((word) => ({
      letters: [...word].map((char) => {
        const i = index++
        const fromPile = total - 1 - i
        return {
          char: char === 'é' ? 'e' : char,
          index: i,
          accent: char === 'é',
          from: {
            x: `${(fromPile * 0.5 + (random() - 0.5) * 0.3).toFixed(3)}em`,
            y: `${(-random() * 0.95).toFixed(3)}em`,
            rotate: Math.round((random() - 0.5) * 64),
          },
          delay: 0.12 + fromPile * STAGGER,
        }
      }),
    }))
    return { words, accentDelay: 0.12 + total * STAGGER + 0.15, still }
  }, [text, seed, still])
}
