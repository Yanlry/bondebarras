import { useEffect, useId, useRef, useState } from 'react'
import { getPage } from '../../data/pages'
import { QUOTE_PATH } from '../../data/navigation'
import { servicePages } from '../../data/services'
import { cn } from '../../lib/cn'
import { Icon } from '../Icon'
import { SmartLink } from '../SmartLink'
import type { PrestationsMenuProps } from './types'

/** Délais d'ouverture et de fermeture au survol (ms) : le menu ne clignote pas en passant. */
const OPEN_DELAY = 70
const CLOSE_DELAY = 220

/**
 * Menu « Prestations » (desktop), motif « disclosure » : un bouton
 * `aria-expanded` ouvre un panneau de liens. Ouverture au clic, au clavier
 * (Entrée / Espace) et au survol (avec délai) ; fermeture par Échap (le focus
 * revient au bouton), clic extérieur, sortie du focus ou changement de page.
 * Les liens restent dans le HTML pré-rendu (référencement), masqués par
 * `visibility` quand le menu est fermé.
 */
export function PrestationsMenu({ pathname }: PrestationsMenuProps) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const timer = useRef(0)
  const panelId = useId()
  const inSection = pathname === '/prestations' || pathname.startsWith('/prestations/')

  const schedule = (next: boolean, delay: number) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(next), delay)
  }

  // Changement de page : le menu se ferme.
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      button.current?.focus()
    }
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <div
      ref={root}
      className="relative"
      onPointerEnter={(event) => event.pointerType === 'mouse' && schedule(true, OPEN_DELAY)}
      onPointerLeave={(event) => event.pointerType === 'mouse' && schedule(false, CLOSE_DELAY)}
      onBlur={(event) => {
        if (!root.current?.contains(event.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          window.clearTimeout(timer.current)
          setOpen((value) => !value)
        }}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-air-deep',
          inSection ? 'text-bleu' : 'text-ink',
        )}
      >
        Prestations
        <Icon name="chevron-down" className={cn('size-4 transition-transform duration-300', open && 'rotate-180')} />
      </button>

      <div
        id={panelId}
        data-open={open}
        className="nav-panel absolute top-[calc(100%+0.85rem)] left-1/2 w-[min(54rem,calc(100vw-4rem))]"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_15rem] gap-3 rounded-[1.6rem] border border-trace bg-air p-3 shadow-[0_30px_60px_-28px_rgb(20_32_51/0.45)]">
          <ul className="grid grid-cols-2 gap-1">
            {servicePages.map((page) => {
              const path = getPage(page.id).path
              return (
                <li key={page.id}>
                  <SmartLink
                    href={path}
                    className="group flex gap-3 rounded-2xl p-3 transition-colors hover:bg-white aria-[current=page]:bg-bleu-soft"
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-10 flex-none place-items-center rounded-xl border-2 border-dashed border-bleu/35 text-bleu transition-colors duration-300 group-hover:border-solid group-hover:border-bleu"
                    >
                      <Icon name={page.icon} className="size-5" />
                    </span>
                    <span>
                      <span className="block font-display text-[0.98rem] leading-tight font-semibold text-ink">{page.navLabel}</span>
                      <span className="mt-0.5 block text-[0.83rem] leading-snug text-ink-soft">{page.menuDescription}</span>
                    </span>
                  </SmartLink>
                </li>
              )
            })}
          </ul>
          <div className="flex flex-col justify-between rounded-2xl bg-bleu p-5 text-air">
            <div>
              <p className="font-mono text-[0.68rem] tracking-[0.14em] uppercase opacity-80">Le plan complet</p>
              <SmartLink href="/prestations" className="mt-2 inline-flex items-center gap-2 font-display text-lg font-bold hover:underline">
                Toutes nos prestations
                <Icon name="arrow" className="size-4" />
              </SmartLink>
            </div>
            <SmartLink
              href={QUOTE_PATH}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-sangle-deep px-4 py-2.5 font-display text-sm font-semibold text-white transition-colors hover:bg-[#a03413]"
            >
              Devis gratuit
            </SmartLink>
          </div>
        </div>
      </div>
    </div>
  )
}
