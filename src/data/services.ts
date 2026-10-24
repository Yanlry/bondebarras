import type { ServiceCategory, ServiceItem } from '../types/service'

/**
 * Prestations de Bon Débarras, regroupées en 4 familles (les 4 zones du futur
 * plan d'architecte). Ce texte est rendu en HTML classique, indépendamment des
 * animations : il reste lisible et indexable par les moteurs de recherche.
 *
 * TODO (validation opérationnelle) : les prestations `onRequest` sont
 * présentées « sur étude », jamais comme garanties, tant qu'elles ne sont pas
 * confirmées (notamment les déchets particuliers).
 */
export const serviceCategories: readonly ServiceCategory[] = [
  {
    id: 'particuliers',
    title: 'Débarras pour les particuliers',
    audience: 'Maisons, appartements et dépendances',
    chip: 'Maison, appartement',
    summary:
      "Quelques meubles ou une maison entière : nous vidons, trions et évacuons, avant un déménagement, une vente ou une mise en location.",
    items: [
      { label: 'Débarras de maisons et appartements', availability: 'confirmed' },
      { label: 'Caves, greniers, garages et dépendances', availability: 'confirmed' },
      { label: 'Enlèvement de meubles, électroménager et encombrants', availability: 'confirmed' },
      { label: 'Avant déménagement, vente ou mise en location', availability: 'confirmed' },
    ],
    quoteType: 'maison',
    tone: 'standard',
  },
  {
    id: 'succession',
    title: 'Successions et situations délicates',
    audience: 'Après un décès, un départ en EHPAD, un logement très encombré',
    chip: 'Succession',
    summary:
      'Des moments difficiles, traités avec discrétion et respect : nous trions avec vous ce qui doit être conservé, et nous nous occupons du reste.',
    items: [
      { label: 'Débarras après décès et succession', availability: 'confirmed' },
      { label: 'Vidage de logement avant un départ en EHPAD', availability: 'confirmed' },
      {
        label: 'Logements très encombrés, y compris syndrome de Diogène',
        availability: 'confirmed',
        note: 'Sans jugement, en toute discrétion.',
      },
      { label: 'Tri et évacuation des affaires avec respect', availability: 'confirmed' },
    ],
    quoteType: 'succession',
    tone: 'sober',
  },
  {
    id: 'professionnels',
    title: 'Débarras pour les professionnels',
    audience: 'Bureaux, commerces, entrepôts et ateliers',
    chip: 'Locaux pro',
    summary:
      'Fin de bail, réaménagement ou fermeture : nous libérons vos locaux et enlevons le mobilier et le matériel dont vous n’avez plus l’usage.',
    items: [
      { label: 'Débarras de bureaux et locaux commerciaux', availability: 'confirmed' },
      { label: 'Commerces et magasins', availability: 'confirmed' },
      { label: 'Entrepôts, ateliers et bâtiments professionnels', availability: 'confirmed' },
      { label: 'Enlèvement de mobilier et de matériel inutilisés', availability: 'confirmed' },
    ],
    quoteType: 'bureaux',
    tone: 'standard',
  },
  {
    id: 'exterieur',
    title: 'Extérieurs et chantiers',
    audience: 'Terrains, jardins, fins de travaux',
    chip: 'Extérieur',
    summary:
      'Jardins et terrains encombrés, fins de chantier : décrivez-nous la situation, nous étudions chaque demande.',
    items: [
      { label: 'Débarras de terrains et jardins', availability: 'confirmed' },
      // TODO: à confirmer (filières de traitement des déchets particuliers)
      { label: 'Évacuation de déchets verts', availability: 'onRequest' },
      { label: 'Évacuation de gravats et déchets de chantier', availability: 'onRequest' },
      { label: 'Enlèvement d’encombrants et de dépôts sauvages', availability: 'onRequest' },
    ],
    quoteType: 'exterieur',
    tone: 'standard',
  },
]

/** Services complémentaires, communs à toutes les interventions. */
export const complementaryServices: readonly ServiceItem[] = [
  { label: 'Tri des objets et matériaux', availability: 'confirmed' },
  { label: 'Recyclage et valorisation de ce qui peut l’être', availability: 'confirmed' },
  { label: 'Nettoyage léger après débarras', availability: 'confirmed' },
  { label: 'Devis gratuit et personnalisé', availability: 'confirmed' },
  {
    label: 'Débarras gratuit possible',
    availability: 'conditional',
    note: 'Uniquement lorsque la valeur des biens récupérables couvre les frais, après évaluation.',
  },
]

/** Libellé affiché pour une prestation « sur étude ». */
export const ON_REQUEST_LABEL = 'Sur étude'
