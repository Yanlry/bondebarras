import { motion } from 'framer-motion'
import { memo } from 'react'
import { useTitleArrangement } from '../../hooks/useTitleArrangement'
import { cn } from '../../lib/cn'
import { AccentArrow } from './AccentArrow'
import type { BrandTitleProps } from './types'

/** Ressort du « posé » : la lettre arrive, dépasse à peine, et se pose. */
const SETTLE = { type: 'spring', stiffness: 170, damping: 17, mass: 0.9 } as const

/**
 * Titre signature « Bon Débarras » : les lettres arrivent en vrac puis se
 * rangent (voir `useTitleArrangement`). Le texte est lu une seule fois par
 * les lecteurs d'écran et les moteurs de recherche (copie `sr-only`).
 */
export const BrandTitle = memo(function BrandTitle({ text = 'Bon Débarras', play, className }: BrandTitleProps) {
  const { words, accentDelay, still } = useTitleArrangement(text)

  return (
    <span className={cn('block font-display font-extrabold tracking-[-0.045em] leading-[0.9]', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="flex flex-wrap gap-x-[0.24em]">
        {words.map((word, w) => (
          <span key={w} className="inline-flex whitespace-nowrap">
            {word.letters.map((letter) => (
              <motion.span
                key={letter.index}
                className="relative inline-block will-change-transform"
                initial={still ? false : { ...letter.from, opacity: 0 }}
                animate={play || still ? { x: 0, y: 0, rotate: 0, opacity: 1 } : undefined}
                transition={{ ...SETTLE, delay: letter.delay, opacity: { duration: 0.2, delay: letter.delay * 0.25 } }}
              >
                {letter.char}
                {letter.accent && (
                  <motion.span
                    className="absolute top-[-0.07em] left-[0.21em] block w-[0.28em] text-sangle"
                    initial={still ? false : { x: '1.4em', y: '-1.5em', rotate: -120, opacity: 0 }}
                    animate={play || still ? { x: 0, y: 0, rotate: 0, opacity: 1 } : undefined}
                    transition={{ ...SETTLE, stiffness: 140, delay: accentDelay }}
                  >
                    <AccentArrow className="block w-full" />
                  </motion.span>
                )}
              </motion.span>
            ))}
          </span>
        ))}
      </span>
    </span>
  )
})
