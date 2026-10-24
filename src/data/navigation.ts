import type { NavLink } from '../types/navigation'

/** Liens de l'en-tête (ancres de la page unique). */
export const navLinks: readonly NavLink[] = [
  { label: 'Prestations', href: '#prestations' },
  { label: 'Devis gratuit', href: '#devis' },
  { label: 'Contact', href: '#contact' },
]

/** Identifiant de la section du formulaire (lien d'évitement, boutons « Devis »). */
export const QUOTE_ANCHOR = '#devis'
