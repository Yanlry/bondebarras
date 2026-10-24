import { Breadcrumb } from '../Breadcrumb'
import { ProvisionalNotice } from '../ProvisionalNotice'
import type { LegalDocumentProps } from './types'

/**
 * Mise en page éditoriale des documents légaux : colonne de lecture étroite,
 * titres H2 numérotés par le contenu, encart « document en cours de rédaction ».
 */
export function LegalDocument({ page, title, children }: LegalDocumentProps) {
  return (
    <article className="mx-auto max-w-3xl px-5 pt-28 pb-24 sm:px-8 sm:pt-32">
      <Breadcrumb page={page} />
      <h1 className="mt-8 font-display text-[clamp(2.3rem,6vw,3.8rem)] leading-[0.98] font-extrabold tracking-[-0.04em] text-ink">{title}</h1>
      <ProvisionalNotice title="Document en cours de rédaction" className="mt-8">
        Les informations marquées « À compléter » doivent être fournies et le texte validé avant la mise en ligne du site.
      </ProvisionalNotice>
      <div className="legal-prose mt-12 space-y-12">{children}</div>
    </article>
  )
}
