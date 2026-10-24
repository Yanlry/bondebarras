import { memo } from 'react'
import { clearCaptions, clearedCopy } from '../../data/room-story'

/**
 * Pendant le débarras (mode animé uniquement) : trois légendes qui se
 * relaient et la jauge « Pièce libérée », remplie au rythme du scroll
 * (`scaleX`, pilotée par la timeline). Décoratif : le même message est lu
 * dans la description `sr-only` et le texte final.
 */
export const ClearProgress = memo(function ClearProgress() {
  return (
    // Positionné sans `translate` : GSAP anime ce bloc et réécrit translate / transform.
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-5 bottom-[max(6svh,5.5rem)] hidden scene:block lg:inset-x-auto lg:inset-y-0 lg:left-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:w-[min(30vw,24rem)] lg:scene:flex lg:scene:items-center"
    >
      <div data-clear-progress className="invisible w-full">
      <div className="relative h-[7.5rem] lg:h-[9.5rem]">
        {clearCaptions.map((caption) => (
          <div key={caption.title} data-clear-caption className="invisible absolute inset-x-0 bottom-0 lg:top-0 lg:bottom-auto">
            <p className="font-display text-[clamp(2.4rem,9vw,3rem)] leading-none font-extrabold tracking-[-0.04em] text-ink lg:text-[clamp(2.6rem,4.4vw,3.8rem)]">
              {caption.title}
            </p>
            <p className="mt-2 max-w-[30ch] text-base text-ink-soft lg:mt-3 lg:text-lg">{caption.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 lg:mt-6">
        <p className="mb-2 font-mono text-xs tracking-[0.14em] text-ink-soft uppercase">{clearedCopy.gauge}</p>
        <div className="h-2.5 overflow-hidden rounded-full bg-trace">
          <div data-gauge-fill className="h-full origin-left scale-x-0 rounded-full bg-sangle will-change-transform" />
        </div>
      </div>
      </div>
    </div>
  )
})
