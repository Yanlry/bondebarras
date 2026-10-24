import type { QuoteTypeId } from '../types/quote'

/*
 * Type de débarras présélectionné dans le formulaire de devis, quand le
 * visiteur clique « Devis pour ce débarras » depuis une prestation.
 * Simple store externe (lu via `useSyncExternalStore`).
 */

type Listener = () => void

let selected: QuoteTypeId | null = null
const listeners = new Set<Listener>()

export const quoteDraft = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getType: (): QuoteTypeId | null => selected,
  /** Présélectionne un type (le formulaire le reprend à son affichage). */
  selectType(type: QuoteTypeId): void {
    selected = type
    listeners.forEach((listener) => listener())
  },
}
