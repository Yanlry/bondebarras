import { memo } from 'react'
import { Icon } from '../../components/Icon'
import { SmartLink } from '../../components/SmartLink'
import { getPage } from '../../data/pages'
import { clearCaptions, clearedCopy } from '../../data/room-story'

/**
 * Pendant que la pièce se vide (mode animé uniquement) : les trois prestations
 * principales se relaient — « Pour votre maison. », « Pour vos proches. »,
 * « Pour votre entreprise. » —, chacune avec un lien vers sa page, et la jauge
 * « Pièce libérée » se remplit au rythme du scroll (`scaleX`). Seule la légende
 * affichée est visible et atteignable (les autres sont masquées par la timeline).
 */
export const ClearProgress = memo(function ClearProgress() {
  return (
    // Positionné sans `translate` : GSAP anime ce bloc et réécrit translate / transform.
    <div className="pointer-events-none absolute inset-x-5 bottom-[max(6svh,5.5rem)] hidden scene:block lg:inset-x-auto lg:inset-y-0 lg:left-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:w-[min(30vw,24rem)] lg:scene:flex lg:scene:items-center">
      <div data-clear-progress className="invisible w-full">
        <div className="relative h-[11rem] lg:h-[16rem]">
          {clearCaptions.map((caption) => (
            <div key={caption.title} data-clear-caption className="pointer-events-auto invisible absolute inset-x-0 bottom-0 lg:top-0 lg:bottom-auto">
              <p className="font-display text-[clamp(2.1rem,8.6vw,2.8rem)] leading-none max-sm:[@media(max-height:760px)]:text-[1.85rem] font-extrabold tracking-[-0.04em] text-ink lg:text-[clamp(2.4rem,3.9vw,3.4rem)]">
                {caption.title}
              </p>
              <p className="mt-2 max-w-[32ch] text-base text-ink-soft max-sm:[@media(max-height:760px)]:text-[0.95rem] lg:mt-3 lg:text-lg">{caption.text}</p>
              <SmartLink
                href={getPage(caption.page).path}
                className="mt-2 inline-flex items-center gap-2 font-display font-semibold text-bleu hover:underline lg:mt-4"
              >
                Découvrir
                <Icon name="arrow" className="size-4" />
              </SmartLink>
            </div>
          ))}
        </div>

        <div aria-hidden="true" className="mt-6">
          <p className="mb-2 font-mono text-xs tracking-[0.14em] text-ink-soft uppercase">{clearedCopy.gauge}</p>
          <div className="h-2.5 overflow-hidden rounded-full bg-trace">
            <div data-gauge-fill className="h-full origin-left scale-x-0 rounded-full bg-sangle will-change-transform" />
          </div>
        </div>
      </div>
    </div>
  )
})
