import { cn } from '../../lib/cn'
import { Breadcrumb } from '../Breadcrumb'
import { PlanDecor } from '../PlanDecor'
import type { PageIntroProps } from './types'

/**
 * Introduction des pages secondaires : fil d'Ariane, étiquette, grand H1
 * éditorial, accroche, actions, et (option) le plan décoratif de la page.
 */
export function PageIntro({ page, tag, title, lede, actions, plan, sober = false }: PageIntroProps) {
  return (
    <header className={cn('relative overflow-clip pt-28 pb-14 sm:pt-32 sm:pb-20', sober ? 'bg-air' : 'bg-[radial-gradient(70%_80%_at_85%_10%,#fffdf8_0%,#f6f3ec_60%)]')}>
      <div className={cn('mx-auto grid max-w-7xl gap-12 px-5 sm:px-8', plan && 'lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center')}>
        <div>
          <Breadcrumb page={page} />
          <p className={cn('tag-kraft mt-8', sober && 'bg-air-deep')}>{tag}</p>
          <h1 className="mt-5 max-w-[17ch] font-display text-[clamp(2.5rem,7vw,4.9rem)] leading-[0.95] font-extrabold tracking-[-0.045em] text-balance text-ink">
            {title}
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink-soft sm:text-xl">{lede}</p>
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </div>
        {plan && <PlanDecor layout={plan} className="max-lg:max-w-md" />}
      </div>
    </header>
  )
}
