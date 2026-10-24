import { cn } from '../../lib/cn'
import type { ProvisionalNoticeProps } from './types'

/**
 * Encart « en préparation » : signale clairement ce qui n'est pas finalisé
 * (informations légales incomplètes, envoi du formulaire non activé…).
 */
export function ProvisionalNotice({ title, children, className }: ProvisionalNoticeProps) {
  return (
    <aside role="note" className={cn('rounded-2xl border-2 border-dashed border-kraft bg-kraft-light/45 px-5 py-4 sm:px-6', className)}>
      <p className="font-mono text-xs font-medium tracking-[0.12em] text-ink uppercase">{title}</p>
      <div className="mt-1.5 text-ink-soft">{children}</div>
    </aside>
  )
}
