import type { Site } from '../types/site'

/**
 * Réglages globaux.
 *
 * TODO (mise en production) :
 * - `url` : renseigner le domaine définitif (le `.example` actuel est réservé, il ne pointe nulle part) ;
 * - `status` : passer à `live` seulement après validation des contenus, des liens et du formulaire.
 */
export const site: Site = {
  name: 'Bon Débarras',
  url: { value: 'https://www.bon-debarras.example', provisional: true },
  status: 'preview',
  locale: 'fr_FR',
}
