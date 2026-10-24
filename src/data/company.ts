import type { Company } from '../types/company'

/**
 * Coordonnées de Bon Débarras.
 *
 * TODO (avant mise en ligne) : toutes les valeurs `provisional: true` sont des
 * placeholders. Elles sont affichées comme provisoires sur le site et listées
 * dans le README (« À compléter »).
 */
export const company: Company = {
  name: 'Bon Débarras',
  tagline: 'Débarras, désencombrement et évacuation',
  // Numéro officiel, fourni par Bon Débarras
  phone: { value: { display: '06 62 83 26 57', href: 'tel:+33662832657' }, provisional: false },
  // TODO: adresse e-mail réelle
  email: { value: 'contact@exemple.fr', provisional: true },
  // TODO: adresse réelle
  address: { value: 'Adresse à venir', provisional: true },
  // TODO: zones d'intervention réelles (villes, départements)
  serviceArea: { value: "Zone d'intervention à préciser", provisional: true },
  // TODO: horaires réels
  hours: { value: 'Horaires à venir', provisional: true },
}
