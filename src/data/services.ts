import type { ServiceCategory, ServiceItem, ServicePage, ServicePageId } from '../types/service'

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
    pageId: 'debarras-particuliers',
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
    pageId: 'debarras-succession',
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
    pageId: 'debarras-professionnels',
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
    pageId: 'debarras-exterieur',
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

const itemsOf = (id: ServiceCategory['id']): readonly ServiceItem[] =>
  serviceCategories.find((category) => category.id === id)?.items ?? []

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

/**
 * Les 7 pages de prestation (menu Prestations, page /prestations, pages dédiées).
 * Contenu de base, tiré du périmètre fourni par Bon Débarras ; il sera enrichi
 * (déroulé, conseils, questions fréquentes) à l'étape des pages de prestation.
 */
export const servicePages: readonly ServicePage[] = [
  {
    id: 'debarras-particuliers',
    navLabel: 'Particuliers',
    menuDescription: 'Maisons, appartements, meubles et encombrants',
    icon: 'house',
    h1: 'Débarras de maison et d’appartement',
    lede: 'Quelques meubles ou une maison entière : nous vidons, trions et évacuons, avant un déménagement, une vente ou une mise en location.',
    itemsTitle: 'Ce que nous prenons en charge',
    items: itemsOf('particuliers'),
    quoteType: 'maison',
    tone: 'standard',
    related: ['debarras-cave-grenier-garage', 'tri-recyclage', 'debarras-succession'],
  },
  {
    id: 'debarras-succession',
    navLabel: 'Succession et situations délicates',
    menuDescription: 'Après un décès, un départ en EHPAD, un logement très encombré',
    icon: 'frame',
    h1: 'Débarras après décès et succession',
    lede: 'Des moments difficiles, traités avec discrétion et respect : nous trions avec vous ce qui doit être conservé, et nous nous occupons du reste.',
    itemsTitle: 'Les situations que nous accompagnons',
    items: itemsOf('succession'),
    quoteType: 'succession',
    tone: 'sober',
    related: ['syndrome-de-diogene', 'debarras-particuliers', 'tri-recyclage'],
  },
  {
    id: 'debarras-professionnels',
    navLabel: 'Professionnels',
    menuDescription: 'Bureaux, commerces, entrepôts et ateliers',
    icon: 'office',
    h1: 'Débarras de bureaux et de locaux professionnels',
    lede: 'Fin de bail, réaménagement ou fermeture : nous libérons vos locaux et enlevons le mobilier et le matériel dont vous n’avez plus l’usage.',
    itemsTitle: 'Ce que nous prenons en charge',
    items: itemsOf('professionnels'),
    quoteType: 'bureaux',
    tone: 'standard',
    related: ['tri-recyclage', 'debarras-exterieur'],
  },
  {
    id: 'debarras-exterieur',
    navLabel: 'Extérieur et chantier',
    menuDescription: 'Terrains, jardins, déchets verts et gravats',
    icon: 'leaf',
    h1: 'Débarras de terrain, de jardin et de fin de chantier',
    lede: 'Jardins et terrains encombrés, fins de chantier : décrivez-nous la situation, nous étudions chaque demande.',
    itemsTitle: 'Ce que nous pouvons prendre en charge',
    items: itemsOf('exterieur'),
    quoteType: 'exterieur',
    tone: 'standard',
    related: ['tri-recyclage', 'debarras-professionnels'],
  },
  {
    id: 'tri-recyclage',
    navLabel: 'Tri, recyclage et valorisation',
    menuDescription: 'Réemploi, recyclage, filières adaptées',
    icon: 'recycle',
    h1: 'Tri, recyclage et valorisation de vos objets',
    lede: 'Ce qui peut encore servir est valorisé, ce qui peut être recyclé l’est, et le reste part vers les filières adaptées.',
    itemsTitle: 'Ce que deviennent vos objets',
    items: [
      { label: 'Tri des objets et des matériaux', availability: 'confirmed' },
      { label: 'Récupération des biens réutilisables', availability: 'confirmed' },
      { label: 'Recyclage de ce qui peut l’être', availability: 'confirmed' },
      { label: 'Évacuation vers les filières adaptées', availability: 'confirmed' },
      {
        label: 'Débarras gratuit possible',
        availability: 'conditional',
        note: 'Uniquement lorsque la valeur des biens récupérables couvre les frais, après évaluation.',
      },
    ],
    quoteType: 'autre',
    tone: 'standard',
    related: ['debarras-particuliers', 'debarras-professionnels', 'debarras-succession'],
  },
  {
    id: 'debarras-cave-grenier-garage',
    navLabel: 'Cave, grenier, garage',
    menuDescription: 'Caves, combles, garages et dépendances',
    icon: 'stairs',
    h1: 'Débarras de cave, de grenier et de garage',
    lede: 'Ces espaces se remplissent sans qu’on y pense : nous trions, sortons et évacuons ce qui les encombre.',
    itemsTitle: 'Les espaces que nous vidons',
    items: [
      { label: 'Caves et sous-sols', availability: 'confirmed' },
      { label: 'Greniers et combles', availability: 'confirmed' },
      { label: 'Garages', availability: 'confirmed' },
      { label: 'Dépendances et abris', availability: 'confirmed' },
    ],
    quoteType: 'cave',
    tone: 'standard',
    related: ['debarras-particuliers', 'tri-recyclage'],
  },
  {
    id: 'syndrome-de-diogene',
    navLabel: 'Syndrome de Diogène',
    menuDescription: 'Logements très encombrés, sans jugement',
    icon: 'door',
    h1: 'Débarras d’un logement très encombré : syndrome de Diogène',
    lede: 'Sans jugement et en toute discrétion : nous vidons et trions les logements très encombrés, à votre rythme et dans le respect de la personne.',
    itemsTitle: 'Ce que nous prenons en charge',
    items: [
      { label: 'Débarras de logements très encombrés', availability: 'confirmed', note: 'Sans jugement, en toute discrétion.' },
      { label: 'Tri des affaires à conserver', availability: 'confirmed' },
      { label: 'Évacuation de tout le reste', availability: 'confirmed' },
      { label: 'Nettoyage léger après débarras', availability: 'confirmed' },
    ],
    quoteType: 'tres-encombre',
    tone: 'sober',
    related: ['debarras-succession', 'debarras-particuliers'],
  },
]

const servicePageById = new Map(servicePages.map((page) => [page.id, page]))

/** Une page de prestation. */
export function getServicePage(id: ServicePageId): ServicePage {
  const page = servicePageById.get(id)
  if (!page) throw new Error(`Prestation inconnue : ${id}`)
  return page
}
