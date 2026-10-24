import { motion } from 'framer-motion'
import { memo } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { ActionLink } from '../../components/ActionLink'
import { BrandTitle } from '../../components/BrandTitle'
import { Icon } from '../../components/Icon'
import { SmartLink } from '../../components/SmartLink'
import { company } from '../../data/company'
import { getPage } from '../../data/pages'
import { QUOTE_PATH } from '../../data/navigation'
import { heroCopy } from '../../data/room-story'
import { serviceCategories } from '../../data/services'
import type { HeroCopyProps } from './types'

/** Apparition douce des blocs secondaires, après le titre (aucune avec le mouvement réduit). */
const fadeUp = (delay: number, play: boolean, still: boolean) => ({
  initial: still ? false : { opacity: 0, y: 22 },
  animate: play ? { opacity: 1, y: 0 } : undefined,
  transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
})

/**
 * Texte du hero : en quelques secondes, le visiteur sait ce que fait
 * Bon Débarras, pour qui, et comment demander un devis ou appeler.
 * Les pastilles « Votre situation » mènent droit à la bonne prestation.
 */
export const HeroCopy = memo(function HeroCopy({ play }: HeroCopyProps) {
  const still = usePrefersReducedMotion()
  return (
    <div data-hero-copy data-intro className="pointer-events-auto flex flex-col items-start">
      <motion.p {...fadeUp(0.05, play, still)} className="tag-kraft">
        <Icon name="box" className="size-4 text-bleu" />
        {heroCopy.eyebrow}
      </motion.p>

      <h1 id="hero-title" className="mt-4 sm:mt-5">
        <BrandTitle play={play} className="text-[clamp(3rem,min(15vw,11svh),4.6rem)] text-ink lg:text-[clamp(4.2rem,min(7.4vw,13svh),7.4rem)]" />
        <motion.span
          {...fadeUp(1.15, play, still)}
          className="mt-3 block max-w-[24ch] font-display text-[clamp(1.12rem,4.6vw,1.4rem)] leading-tight font-semibold tracking-[-0.015em] text-bleu lg:mt-5 lg:text-[clamp(1.3rem,1.8vw,1.75rem)]"
        >
          {heroCopy.headline}
        </motion.span>
      </h1>

      {/* Écran de téléphone bas (375 × 667) : l'accroche cède la place aux boutons */}
      <motion.p
        {...fadeUp(1.3, play, still)}
        className="mt-3 max-w-[44ch] text-[0.98rem] text-ink-soft max-sm:[@media(max-height:760px)]:hidden sm:text-lg lg:mt-4"
      >
        {heroCopy.lede}
      </motion.p>

      <motion.div {...fadeUp(1.45, play, still)} className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3 lg:mt-7">
        <ActionLink href={QUOTE_PATH} size="lg" icon="arrow">
          <span className="sm:hidden">Devis gratuit</span>
          <span className="hidden sm:inline">Demander un devis gratuit</span>
        </ActionLink>
        <ActionLink href={company.phone.value.href} variant="secondary" size="lg" icon="phone">
          Appeler <span className="ml-1 hidden min-[1440px]:inline">{company.phone.value.display}</span>
        </ActionLink>
      </motion.div>

      <motion.nav
        {...fadeUp(1.6, play, still)}
        aria-label="Votre situation"
        className="mt-5 hidden flex-wrap items-center gap-2 sm:flex lg:mt-8 [@media(max-height:820px)]:hidden"
      >
        <span className="mr-1 font-mono text-xs tracking-[0.12em] text-ink-soft uppercase">{heroCopy.situationsLabel}</span>
        {serviceCategories.map((category) => (
          <SmartLink
            key={category.id}
            href={getPage(category.pageId).path}
            className="footprint rounded-full border-bleu/35 px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:border-solid hover:border-bleu hover:bg-bleu-soft"
          >
            {category.chip}
          </SmartLink>
        ))}
      </motion.nav>
    </div>
  )
})
