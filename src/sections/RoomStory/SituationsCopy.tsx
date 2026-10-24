import { memo } from 'react'
import { Icon } from '../../components/Icon'
import { SmartLink } from '../../components/SmartLink'
import { getPage } from '../../data/pages'
import { situationsCopy } from '../../data/room-story'
import { situations } from '../../data/situations'

/**
 * Scène 2 « Vous vous reconnaissez ? » : la légende des étiquettes, avec les
 * vrais liens vers chaque prestation (lecteurs d'écran, clavier, référencement).
 *
 * Mode animé : posée sur la scène épinglée (colonne de gauche sur desktop, bas
 * de l'écran sur mobile) ; chaque ligne s'allume quand son étiquette s'accroche.
 * Mode statique (état par défaut du DOM) : une section normale entre le hero et
 * « Place nette », avec les six situations en étiquettes.
 */
export const SituationsCopy = memo(function SituationsCopy() {
  return (
    <div
      data-situations
      role="group"
      aria-labelledby="situations-title"
      className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 scene:pointer-events-none scene:absolute scene:inset-x-5 scene:bottom-[max(6svh,5.5rem)] scene:max-w-none scene:p-0 scene:lg:inset-x-auto scene:lg:inset-y-0 scene:lg:left-[max(2rem,calc((100vw-80rem)/2+2rem))] scene:lg:flex scene:lg:w-[min(28vw,24rem)] scene:lg:items-center"
    >
      <div className="scene:pointer-events-auto scene:w-full">
        <p className="tag-kraft max-lg:scene:hidden scene:[@media(max-height:780px)]:hidden">{situationsCopy.tag}</p>
        <h2
          id="situations-title"
          className="mt-4 font-display scene:[@media(max-height:780px)]:mt-0 text-[clamp(2rem,8vw,2.6rem)] leading-[0.98] font-extrabold tracking-[-0.04em] text-ink max-lg:scene:mt-0 max-sm:scene:[@media(max-height:760px)]:text-[1.6rem] lg:text-[clamp(2.4rem,min(3.8vw,6.5svh),3.4rem)]"
        >
          {situationsCopy.title}
        </h2>
        <p className="mt-3 max-w-[36ch] text-ink-soft max-lg:scene:hidden lg:text-lg scene:[@media(max-height:780px)]:hidden">{situationsCopy.text}</p>
        <ol className="mt-5 grid lg:scene:[@media(max-height:780px)]:mt-4 gap-1 sm:grid-cols-2 sm:gap-x-12 scene:grid-cols-1 scene:gap-x-0 scene:gap-0 max-lg:scene:mt-3 lg:mt-7">
          {situations.map((situation, i) => (
            <li key={situation.id} data-situation-item>
              <SmartLink
                href={getPage(situation.page).path}
                className="group flex items-center gap-3 rounded-xl py-2 text-ink transition-colors hover:text-bleu max-lg:scene:py-1 max-sm:scene:[@media(max-height:760px)]:py-0.5 max-sm:scene:[@media(max-height:760px)]:text-[0.88rem] sm:py-2.5 lg:scene:[@media(max-height:780px)]:py-1.5"
              >
                <span className="font-mono text-xs text-ink-soft">0{i + 1}</span>
                <span className="flex-1 border-b-2 border-dashed border-trace pb-1 font-medium transition-colors group-hover:border-bleu max-lg:scene:text-[0.94rem] max-sm:scene:[@media(max-height:760px)]:text-[0.88rem]">
                  <span className="max-lg:scene:hidden">{situation.label}</span>
                  <span className="hidden max-lg:scene:inline">{situation.short}</span>
                </span>
                <Icon name="arrow" className="size-4 flex-none text-bleu transition-transform group-hover:translate-x-1" />
              </SmartLink>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
})
