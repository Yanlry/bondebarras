import type { NavLink } from '../types/navigation'

/** Chemin de la page de devis. */
export const QUOTE_PATH = '/devis'

/** Liens principaux de l'en-tête (le menu Prestations est construit à part). */
export const mainNav: readonly NavLink[] = [
  { label: 'Accueil', href: '/' },
  { label: 'Prestations', href: '/prestations' },
  { label: 'Notre entreprise', href: '/entreprise' },
  { label: 'Contact', href: '/contact' },
]

/** Liens légaux (pied de page). */
export const legalNav: readonly NavLink[] = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'Confidentialité', href: '/confidentialite' },
]
