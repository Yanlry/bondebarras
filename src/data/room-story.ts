import type { ServicePageId } from '../types/service'

/**
 * Textes de la scène « La pièce pleine → Place nette ».
 * Aucune donnée chiffrée : la jauge est un repère visuel, pas une mesure.
 */
export const heroCopy = {
  eyebrow: 'Particuliers & professionnels',
  headline: 'Débarras de maisons, appartements, caves et locaux professionnels',
  lede: 'Nous vidons, trions et évacuons, de quelques meubles à un bâtiment entier. Votre devis est gratuit.',
  situationsLabel: 'Votre situation :',
  scrollCue: 'Faites de la place',
} as const

/** Scène 2 : l'identification des situations. */
export const situationsCopy = {
  tag: 'Votre situation',
  title: 'Vous vous reconnaissez ?',
  text: 'Chaque débarras est différent. Choisissez le vôtre pour voir comment nous intervenons.',
} as const

/**
 * Les trois légendes qui se relaient pendant que la pièce se vide : les trois
 * prestations principales, du point de vue des personnes, chacune vers sa page.
 */
export const clearCaptions = [
  {
    title: 'Pour votre maison.',
    text: 'Appartement, cave, grenier ou garage : de quelques meubles à la maison entière, nous faisons de la place.',
    page: 'debarras-particuliers',
  },
  {
    title: 'Pour vos proches.',
    text: 'Après un décès ou avant un départ en EHPAD, nous intervenons avec discrétion et respect.',
    page: 'debarras-succession',
  },
  {
    title: 'Pour votre entreprise.',
    text: 'Bureaux, commerces, entrepôts : nous libérons vos locaux et enlevons ce qui ne sert plus.',
    page: 'debarras-professionnels',
  },
] as const satisfies ReadonlyArray<{ title: string; text: string; page: ServicePageId }>

export const clearedCopy = {
  tag: 'Place nette',
  title: 'Bon débarras.',
  text: 'Une pièce vide, un sol dégagé, de la lumière : c’est tout ce que nous vous laissons.',
  gauge: 'Pièce libérée',
} as const

/** Description de la scène pour les lecteurs d'écran (la 3D est décorative). */
export const roomSceneDescription =
  'Illustration : une pièce encombrée de meubles, de cartons et de sacs. Au fil du défilement, les objets sont soulevés et sortent un à un par la porte en laissant leur empreinte au sol ; des étiquettes de situations s’accrochent à ces empreintes, puis la lumière revient et la pièce est vide et lumineuse. Seul reste un carton.'

/** Images de la pièce (secours sans WebGL, et mode statique). Générées depuis la 3D : `npm run capture:room`. */
export const roomImages = {
  before: { src: `${import.meta.env.BASE_URL}images/piece-avant.webp`, alt: 'La pièce encombrée, avant le débarras.' },
  after: { src: `${import.meta.env.BASE_URL}images/piece-apres.webp`, alt: 'La même pièce, vide et lumineuse, après le débarras.' },
  width: 1600,
  height: 1100,
} as const
