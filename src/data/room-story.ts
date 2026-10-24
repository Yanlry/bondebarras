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

/** Les trois légendes qui se relaient pendant que la pièce se vide. */
export const clearCaptions = [
  { title: 'On trie.', text: 'Ce qui se garde, ce qui se donne, ce qui se recycle.' },
  { title: 'On porte.', text: 'Meubles, cartons, électroménager : nous chargeons tout.' },
  { title: 'On évacue.', text: 'Ce qui peut encore servir est valorisé, le reste est évacué.' },
] as const

export const clearedCopy = {
  tag: 'Place nette',
  title: 'Bon débarras.',
  text: 'Une pièce vide, un sol dégagé, de la lumière : c’est tout ce que nous vous laissons.',
  gauge: 'Pièce libérée',
} as const

/** Description de la scène pour les lecteurs d'écran (la 3D est décorative). */
export const roomSceneDescription =
  'Illustration : une pièce encombrée de meubles, de cartons et de sacs. Au fil du défilement, les objets sont soulevés et sortent un à un par la porte, laissant leur empreinte au sol, jusqu’à ce que la pièce soit vide et lumineuse. Seul reste un carton.'

/** Images de la pièce (secours sans WebGL, et mode statique). Générées depuis la 3D : `npm run capture:room`. */
export const roomImages = {
  before: { src: `${import.meta.env.BASE_URL}images/piece-avant.webp`, alt: 'La pièce encombrée, avant le débarras.' },
  after: { src: `${import.meta.env.BASE_URL}images/piece-apres.webp`, alt: 'La même pièce, vide et lumineuse, après le débarras.' },
  width: 1600,
  height: 1100,
} as const
