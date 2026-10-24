import { Icon } from '../../components/Icon'
import { ON_REQUEST_LABEL } from '../../data/services'
import type { ServiceLineProps } from './types'

/**
 * Une prestation. Celles qui attendent une validation opérationnelle sont
 * marquées « Sur étude » (jamais présentées comme garanties) ; les
 * prestations sous condition affichent leur condition.
 */
export function ServiceLine({ item }: ServiceLineProps) {
  return (
    <li className="flex gap-3">
      <Icon name="check" className="mt-0.5 size-5 flex-none text-bleu" />
      <span>
        <span className="text-ink">{item.label}</span>
        {item.availability === 'onRequest' && (
          <span className="ml-2 inline-block rounded-sm bg-kraft-light px-1.5 py-0.5 align-[0.1em] font-mono text-[0.68rem] tracking-[0.08em] text-ink uppercase">
            {ON_REQUEST_LABEL}
          </span>
        )}
        {item.note && <span className="mt-0.5 block text-sm text-ink-soft">{item.note}</span>}
      </span>
    </li>
  )
}
