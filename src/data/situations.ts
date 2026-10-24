import type { Situation } from '../types/situation'

/**
 * Les six situations de « Vous vous reconnaissez ? », dans leur ordre d'apparition.
 * La scène arrive quand la pièce est vide : pour chaque situation, ses objets
 * (`items`) repassent la porte et reviennent à leur place, puis l'étiquette
 * s'accroche dessus. Objets présents aussi sur mobile, sauf la plante (jardin),
 * dont l'étiquette est accrochée à la fenêtre. Côtés et longueurs de ficelle
 * choisis pour que les étiquettes ne se chevauchent pas (vérifié en capture et par les tests).
 */
export const situations: readonly Situation[] = [
  {
    id: 'maison',
    label: 'Une maison ou un appartement à vider avant une vente',
    short: 'Maison à vider',
    page: 'debarras-particuliers',
    items: ['armoire'],
    anchor: [-2.2, 2.02, -1.95],
    side: 'right',
    mobileSide: 'right',
    string: 30,
  },
  {
    id: 'cave',
    label: 'Une cave, un grenier ou un garage encombré',
    short: 'Cave, grenier, garage',
    page: 'debarras-cave-grenier-garage',
    items: ['carton-a1', 'carton-a2'],
    anchor: [-1.2, 0.9, -0.6],
    side: 'left',
    mobileSide: 'right',
    string: 78,
  },
  {
    id: 'succession',
    label: 'Une succession, un départ en EHPAD',
    short: 'Succession, EHPAD',
    page: 'debarras-succession',
    items: ['fauteuil'],
    anchor: [1.42, 0.96, 0.32],
    side: 'right',
    mobileSide: 'left',
    string: 30,
  },
  {
    id: 'encombre',
    label: 'Un logement très encombré, sans jugement',
    short: 'Logement très encombré',
    page: 'syndrome-de-diogene',
    items: ['sac-1', 'sac-2'],
    anchor: [-2.15, 0.6, 0.35],
    side: 'left',
    mobileSide: 'right',
    string: 26,
  },
  {
    id: 'bureaux',
    label: 'Des bureaux à libérer en fin de bail',
    short: 'Bureaux, commerces',
    page: 'debarras-professionnels',
    items: ['frigo'],
    anchor: [2.6, 1.6, -0.75],
    side: 'left',
    mobileSide: 'left',
    string: 30,
  },
  {
    id: 'jardin',
    label: 'Un jardin ou un terrain à dégager',
    short: 'Jardin, terrain',
    page: 'debarras-exterieur',
    items: ['plante'],
    anchor: [1.0, 1.0, -2.42],
    side: 'left',
    mobileSide: 'left',
    string: 96,
  },
]
