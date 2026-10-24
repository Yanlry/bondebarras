import { cn } from '../../lib/cn'
import type { PlanDecorProps, PlanRect } from './types'

const place = (rect: PlanRect) => ({ left: `${rect.x}%`, top: `${rect.y}%`, width: `${rect.w}%`, height: `${rect.h}%` })

/**
 * Décor d'introduction des pages secondaires : un plan d'architecte (papier
 * millimétré, murs en coupe bleus) où ne restent que les empreintes en
 * pointillés des objets enlevés et le carton témoin. Statique et décoratif.
 * Version du socle : chaque page recevra sa propre illustration narrative.
 */
export function PlanDecor({ layout, className }: PlanDecorProps) {
  return (
    <div aria-hidden="true" className={cn('plan-paper relative aspect-[5/4] w-full overflow-hidden rounded-[1.6rem] border border-trace', className)}>
      {/* Murs en coupe (le « poché » du plan) */}
      <span className="absolute top-[8%] left-[8%] h-[3.5%] w-[84%] rounded-sm bg-bleu" />
      <span className="absolute top-[8%] left-[8%] h-[82%] w-[2.8%] rounded-sm bg-bleu" />
      <span className="absolute top-[68%] left-[8%] h-[12%] w-[2.8%] bg-[#f6f3ec]" />
      {layout.footprints.map((rect, i) => (
        <span key={i} className="absolute rounded-md border-2 border-dashed border-bleu/45" style={place(rect)} />
      ))}
      <span className="absolute rounded-[0.3rem] bg-kraft shadow-[0_10px_18px_-10px_rgb(20_32_51/0.5)]" style={place(layout.carton)}>
        <span className="absolute inset-y-0 left-1/2 w-[18%] -translate-x-1/2 bg-sangle" />
      </span>
      <span className="tag-kraft absolute right-[6%] bottom-[7%] rotate-[-3deg] text-[0.68rem] shadow-[0_6px_14px_-8px_rgb(20_32_51/0.45)]">
        {layout.label}
      </span>
    </div>
  )
}
