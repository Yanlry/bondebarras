import { memo, type CSSProperties } from 'react'
import { SmartLink } from '../../components/SmartLink'
import { getPage } from '../../data/pages'
import { situations } from '../../data/situations'
import { cn } from '../../lib/cn'
import type { SituationTagsProps } from './types'

/** Ancrage de l'étiquette selon le côté où elle s'étend, sur mobile et sur desktop. */
const SIDE = {
  mobile: { right: 'max-lg:-left-[5px] max-lg:items-start', left: 'max-lg:-right-[5px] max-lg:items-end' },
  desktop: { right: 'lg:-left-[5px] lg:items-start', left: 'lg:-right-[5px] lg:items-end' },
} as const

/**
 * Scène 2 (mode animé uniquement) : des étiquettes kraft à bagage, accrochées
 * aux objets de la pièce par une ficelle. Chaque calque `data-situation-anchor`
 * est placé à chaque frame par la 3D (`SituationAnchors`) ; l'étiquette elle-même
 * (`data-situation-tag`) est animée par la timeline. Les liens sont aussi dans
 * la légende : ici, ils sont masqués aux lecteurs d'écran et hors du parcours clavier.
 */
export const SituationTags = memo(function SituationTags({ targets }: SituationTagsProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-hidden scene:block">
      {situations.map((situation, i) => (
        <div
          key={situation.id}
          ref={(element) => {
            targets.current[i] = element
          }}
          data-situation-anchor
          className="absolute top-0 left-0 size-0"
          style={{ transform: 'translate3d(-999px, -999px, 0)' }}
        >
          <div
            data-situation-tag
            className={cn(
              'invisible absolute bottom-0 flex flex-col',
              SIDE.mobile[situation.mobileSide],
              SIDE.desktop[situation.side],
            )}
          >
            <SmartLink
              href={getPage(situation.page).path}
              tabIndex={-1}
              className={cn(
                'pointer-events-auto flex items-center gap-2.5 rounded-[0.45rem] bg-kraft-light py-2 pr-3 pl-2.5 shadow-[0_14px_26px_-14px_rgb(20_32_51/0.55)] transition-colors hover:bg-white',
                situation.side === 'right' ? 'lg:rotate-[-2.5deg]' : 'lg:rotate-[2.5deg]',
                situation.mobileSide === 'right' ? 'max-lg:rotate-[-2.5deg]' : 'max-lg:rotate-[2.5deg]',
              )}
            >
              {/* Œillet de l'étiquette */}
              <span className="size-2.5 flex-none rounded-full border-2 border-kraft bg-air" />
              <span className="font-mono text-[0.7rem] font-medium text-ink-soft">0{i + 1}</span>
              <span className="font-display text-[0.86rem] leading-tight font-semibold whitespace-nowrap text-ink lg:text-[0.98rem]">
                {situation.short}
              </span>
            </SmartLink>
            {/* Ficelle jusqu'au point d'accroche */}
            <span
              data-situation-string
              className={cn(
                'h-7 w-px origin-bottom bg-ink/45 lg:h-[var(--string)]',
                situation.mobileSide === 'right' ? 'max-lg:ml-[4.5px]' : 'max-lg:mr-[4.5px]',
                situation.side === 'right' ? 'lg:ml-[4.5px]' : 'lg:mr-[4.5px]',
              )}
              style={{ '--string': `${situation.string}px` } as CSSProperties}
            />
            <span className="size-2.5 rounded-full border-2 border-air bg-sangle shadow-[0_0_0_3px_rgb(228_87_46/0.25)]" />
          </div>
        </div>
      ))}
    </div>
  )
})
