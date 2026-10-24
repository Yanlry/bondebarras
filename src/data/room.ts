import type { RoomItem, RoomPart } from '../types/room'
import type { Vec3 } from '../types/geometry'

/*
 * La pièce encombrée du hero, en maquette : repère fixe en mètres.
 * x de gauche à droite, y vers le haut (sol à 0), z de l'arrière vers l'avant.
 * La pièce est coupée sur l'avant et sur la droite (vue en coupe).
 */

/** Dimensions de la pièce. */
export const ROOM = {
  /** Demi-largeur intérieure (x ∈ [-halfWidth, halfWidth]). */
  halfWidth: 3,
  /** Demi-profondeur intérieure (z ∈ [-halfDepth, halfDepth]). */
  halfDepth: 2.5,
  wallHeight: 3,
  wallThickness: 0.15,
  /** Épaisseur de la dalle (tranche visible, comme sur un plan en coupe). */
  slab: 0.22,
} as const

/** Porte, percée dans le mur de gauche : les objets sortent par là. */
export const DOOR = { z0: 0.8, z1: 1.9, height: 2.2 } as const

/** Fenêtre, percée dans le mur du fond : le rayon de soleil entre par là. */
export const WINDOW = { x0: 0.25, x1: 1.75, y0: 1.0, y1: 2.35 } as const

/** Centre de l'ouverture de la porte (z). */
export const DOOR_Z = (DOOR.z0 + DOOR.z1) / 2

/** Point de passage, juste devant la porte, côté pièce (x, z). */
export const DOOR_INSIDE = [-ROOM.halfWidth + 0.55, DOOR_Z] as const

/** Point de sortie, dans le couloir : l'objet y disparaît, caché par le mur (x, z). */
export const DOOR_OUTSIDE = [-ROOM.halfWidth - 0.75, DOOR_Z] as const

/** Couleurs des objets (sRGB), mates et un peu poudrées, accordées à la palette. */
const C = {
  wood: '#A97E58',
  woodLight: '#B98D66',
  woodDark: '#7E5A3E',
  walnut: '#8C6446',
  kraft: '#C9A27C',
  kraftLight: '#D3AF88',
  kraftDark: '#BE966E',
  tape: '#E3D2B5',
  sangle: '#E4572E',
  air: '#F6F3EC',
  fabric: '#6F86B8',
  fabricDark: '#5D74A6',
  bleu: '#2346A0',
  bleuDark: '#1C3A88',
  ink: '#142033',
  metal: '#3A3F4A',
  grey: '#5A5F6B',
  screen: '#2A3142',
  white: '#F1EEE8',
  seam: '#C9C4BA',
  cream: '#EFE4CC',
  mattress: '#E9E4DA',
  stripe: '#C9D3EA',
  rug: '#B5483A',
  rugCore: '#8F3A2F',
  bag: '#3C4458',
  bagLight: '#4A5368',
  paper: '#E8E2D4',
  paperDark: '#DCD5C5',
  twine: '#9A7350',
  pot: '#C26A48',
  leaf: '#6E8F6A',
  leafDark: '#5E7F5B',
  canvas: '#DDE4F3',
} as const

/** Pavé arrondi. */
const box = (size: Vec3, position: Vec3, color: string, radius = 0.02, rotation?: Vec3): RoomPart => ({
  shape: 'box',
  size,
  position,
  color,
  radius,
  rotation,
})

/** Cylindre (axe vertical, ou couché avec `rotation`). */
const cylinder = (radius: number, height: number, position: Vec3, color: string, radiusTop?: number, rotation?: Vec3): RoomPart => ({
  shape: 'cylinder',
  radius,
  radiusTop,
  height,
  position,
  color,
  rotation,
})

/** Sphère, éventuellement écrasée. */
const sphere = (radius: number, position: Vec3, color: string, scale?: Vec3): RoomPart => ({
  shape: 'sphere',
  radius,
  position,
  color,
  scale,
})

/** Carton fermé et scotché (le témoin porte en plus la sangle orange et une étiquette). */
function carton(w: number, h: number, d: number, color: string = C.kraft, witness = false): RoomPart[] {
  const parts: RoomPart[] = [
    box([w, h, d], [0, h / 2, 0], color, 0.015),
    // Scotch sur la jointure des rabats, qui redescend sur l'avant
    box([0.085, 0.006, d + 0.004], [0, h + 0.001, 0], witness ? C.sangle : C.tape, 0.002),
    box([0.085, h * 0.32, 0.006], [0, h - h * 0.16, d / 2 + 0.002], witness ? C.sangle : C.tape, 0.002),
  ]
  if (witness) {
    parts.push(
      // Sangle qui fait le tour du carton
      box([w + 0.014, 0.06, d + 0.014], [0, h * 0.42, 0], C.sangle, 0.006),
      // Étiquette
      box([0.2, 0.12, 0.008], [-w * 0.22, h * 0.68, d / 2 + 0.004], C.air, 0.004),
      box([0.12, 0.014, 0.01], [-w * 0.22, h * 0.7, d / 2 + 0.006], C.bleu, 0.002),
    )
  }
  return parts
}

/** Les quatre pieds d'un meuble (pavés fins). */
function legs(halfX: number, halfZ: number, height: number, size: number, color: string): RoomPart[] {
  return [-1, 1].flatMap((sx) =>
    [-1, 1].map((sz) => box([size, height, size], [sx * halfX, height / 2, sz * halfZ], color, 0.008)),
  )
}

/**
 * Les objets de la pièce, du premier au dernier à partir (`order`).
 * L'ordre suit la logique d'un vrai débarras : on dégage d'abord ce qui est
 * près de la porte et ce qui est empilé, puis les gros meubles du fond.
 */
export const ROOM_ITEMS: readonly RoomItem[] = [
  {
    id: 'sac-2',
    label: 'Sac',
    kind: 'small',
    position: [-1.85, 0.85],
    baseY: 0,
    yaw: 0.4,
    footprint: [0.5, 0.5],
    order: 1,
    parts: [sphere(0.27, [0, 0.22, 0], C.bagLight, [1, 0.82, 1]), sphere(0.06, [0, 0.46, 0], C.bagLight)],
  },
  {
    id: 'carton-c3',
    label: 'Carton',
    kind: 'box',
    position: [-1.55, 1.35],
    baseY: 0,
    yaw: 0.7,
    footprint: [0.5, 0.42],
    order: 2,
    desktopOnly: true,
    parts: carton(0.5, 0.34, 0.42, C.kraftLight),
  },
  {
    id: 'journaux',
    label: 'Piles de journaux',
    kind: 'small',
    position: [-0.85, 1.6],
    baseY: 0,
    yaw: 0.2,
    footprint: [0.44, 0.34],
    order: 3,
    desktopOnly: true,
    parts: [
      box([0.42, 0.12, 0.32], [0, 0.06, 0], C.paper, 0.01),
      box([0.42, 0.12, 0.32], [0.01, 0.18, 0], C.paperDark, 0.01, [0, 0.08, 0]),
      box([0.42, 0.12, 0.32], [-0.01, 0.3, 0], C.paper, 0.01, [0, -0.06, 0]),
      box([0.43, 0.37, 0.02], [0, 0.185, 0], C.twine, 0.004),
    ],
  },
  {
    id: 'sac-1',
    label: 'Sac',
    kind: 'small',
    position: [-2.15, 0.35],
    baseY: 0,
    yaw: 0,
    footprint: [0.6, 0.6],
    order: 4,
    parts: [sphere(0.32, [0, 0.26, 0], C.bag, [1, 0.82, 1]), sphere(0.07, [0, 0.54, 0], C.bag)],
  },
  {
    id: 'plante',
    label: 'Plante',
    kind: 'small',
    position: [-2.4, 2.05],
    baseY: 0,
    yaw: 0,
    footprint: [0.42, 0.42],
    order: 5,
    desktopOnly: true,
    parts: [
      cylinder(0.17, 0.32, [0, 0.16, 0], C.pot, 0.2),
      sphere(0.26, [0, 0.6, 0], C.leaf),
      sphere(0.2, [0.12, 0.78, 0.05], C.leafDark),
      sphere(0.18, [-0.1, 0.82, -0.06], C.leaf),
    ],
  },
  {
    id: 'chaise',
    label: 'Chaise',
    kind: 'furniture',
    position: [-0.25, 0.95],
    baseY: 0,
    yaw: 0.5,
    footprint: [0.46, 0.46],
    order: 6,
    parts: [
      ...legs(0.19, 0.19, 0.45, 0.04, C.walnut),
      box([0.44, 0.05, 0.44], [0, 0.47, 0], C.wood, 0.012),
      box([0.44, 0.42, 0.04], [0, 0.72, -0.2], C.wood, 0.012),
    ],
  },
  {
    id: 'tapis',
    label: 'Tapis roulé',
    kind: 'small',
    position: [0.25, 1.95],
    baseY: 0,
    yaw: 0.15,
    footprint: [1.7, 0.36],
    order: 7,
    parts: [
      cylinder(0.17, 1.7, [0, 0.17, 0], C.rug, undefined, [0, 0, Math.PI / 2]),
      cylinder(0.09, 1.71, [0, 0.17, 0], C.rugCore, undefined, [0, 0, Math.PI / 2]),
    ],
  },
  {
    id: 'sac-3',
    label: 'Sac',
    kind: 'small',
    position: [1.15, 1.7],
    baseY: 0,
    yaw: 0,
    footprint: [0.52, 0.52],
    order: 8,
    desktopOnly: true,
    parts: [sphere(0.28, [0, 0.23, 0], C.bag, [1, 0.82, 1]), sphere(0.06, [0, 0.48, 0], C.bag)],
  },
  {
    id: 'valise',
    label: 'Valise',
    kind: 'small',
    position: [2.0, 1.75],
    baseY: 0,
    yaw: 0.35,
    footprint: [0.5, 0.26],
    order: 9,
    parts: [
      box([0.5, 0.66, 0.24], [0, 0.36, 0], C.bleu, 0.045),
      box([0.505, 0.03, 0.245], [0, 0.24, 0], C.bleuDark, 0.01),
      box([0.505, 0.03, 0.245], [0, 0.48, 0], C.bleuDark, 0.01),
      box([0.14, 0.04, 0.04], [0, 0.71, 0], C.ink, 0.012),
    ],
  },
  {
    id: 'carton-a3',
    label: 'Carton',
    kind: 'box',
    position: [-1.22, -0.62],
    baseY: 0.88,
    yaw: -0.12,
    footprint: null,
    order: 10,
    desktopOnly: true,
    parts: carton(0.48, 0.36, 0.4, C.kraftLight),
  },
  {
    id: 'carton-a2',
    label: 'Carton',
    kind: 'box',
    position: [-1.18, -0.58],
    baseY: 0.46,
    yaw: 0.25,
    footprint: null,
    order: 11,
    parts: carton(0.56, 0.42, 0.46, C.kraftDark),
  },
  {
    id: 'carton-a1',
    label: 'Carton',
    kind: 'box',
    position: [-1.2, -0.6],
    baseY: 0,
    yaw: 0.05,
    footprint: [0.62, 0.5],
    order: 12,
    parts: carton(0.62, 0.46, 0.5),
  },
  {
    id: 'matelas',
    label: 'Matelas',
    kind: 'furniture',
    position: [-2.68, -0.55],
    baseY: 0,
    yaw: 0,
    footprint: [0.4, 1.35],
    order: 13,
    parts: [
      box([0.22, 1.85, 1.35], [0.04, 0.93, 0], C.mattress, 0.08, [0, 0, 0.09]),
      box([0.226, 1.6, 0.08], [0.04, 0.93, 0.4], C.stripe, 0.02, [0, 0, 0.09]),
      box([0.226, 1.6, 0.08], [0.04, 0.93, -0.4], C.stripe, 0.02, [0, 0, 0.09]),
    ],
  },
  {
    id: 'lampadaire',
    label: 'Lampadaire',
    kind: 'furniture',
    position: [2.45, 0.95],
    baseY: 0,
    yaw: 0,
    footprint: [0.36, 0.36],
    order: 14,
    parts: [
      cylinder(0.16, 0.04, [0, 0.02, 0], C.metal),
      cylinder(0.015, 1.5, [0, 0.77, 0], C.metal),
      cylinder(0.2, 0.3, [0, 1.6, 0], C.cream, 0.13),
    ],
  },
  {
    id: 'fauteuil',
    label: 'Fauteuil',
    kind: 'furniture',
    position: [1.45, 0.35],
    baseY: 0,
    yaw: -0.7,
    footprint: [0.86, 0.8],
    order: 15,
    parts: [
      box([0.78, 0.2, 0.72], [0, 0.12, 0.04], C.fabricDark, 0.04),
      box([0.8, 0.22, 0.75], [0, 0.32, 0.04], C.fabric, 0.07),
      box([0.8, 0.62, 0.18], [0, 0.62, -0.3], C.fabric, 0.08, [-0.12, 0, 0]),
      box([0.14, 0.36, 0.72], [-0.38, 0.5, 0.03], C.fabricDark, 0.06),
      box([0.14, 0.36, 0.72], [0.38, 0.5, 0.03], C.fabricDark, 0.06),
    ],
  },
  {
    id: 'table',
    label: 'Table basse',
    kind: 'furniture',
    position: [0.5, -0.45],
    baseY: 0,
    yaw: -0.08,
    footprint: [0.95, 0.55],
    order: 16,
    parts: [
      ...legs(0.42, 0.22, 0.38, 0.05, C.walnut),
      box([0.95, 0.05, 0.55], [0, 0.4, 0], C.wood, 0.015),
      box([0.3, 0.03, 0.22], [0.15, 0.44, 0.05], C.canvas, 0.006, [0, 0.3, 0]),
    ],
  },
  {
    id: 'carton-c1',
    label: 'Carton',
    kind: 'box',
    position: [-0.35, -1.7],
    baseY: 0,
    yaw: 0.4,
    footprint: [0.5, 0.45],
    order: 17,
    parts: carton(0.5, 0.4, 0.45),
  },
  {
    id: 'carton-b2',
    label: 'Carton',
    kind: 'box',
    position: [0.58, -1.42],
    baseY: 0.5,
    yaw: 0.18,
    footprint: null,
    order: 18,
    parts: carton(0.6, 0.42, 0.5, C.kraftLight),
  },
  {
    id: 'carton-b1',
    label: 'Carton',
    kind: 'box',
    position: [0.55, -1.45],
    baseY: 0,
    yaw: -0.1,
    footprint: [0.72, 0.56],
    order: 19,
    parts: carton(0.72, 0.5, 0.56, C.kraftDark),
  },
  {
    id: 'cadres',
    label: 'Cadres',
    kind: 'small',
    position: [-0.7, -2.18],
    baseY: 0,
    yaw: 0,
    footprint: [1.0, 0.3],
    order: 20,
    parts: [
      box([0.8, 0.6, 0.04], [-0.15, 0.31, 0.02], C.walnut, 0.01, [-0.18, 0, 0]),
      box([0.68, 0.48, 0.02], [-0.15, 0.31, 0.045], C.canvas, 0.005, [-0.18, 0, 0]),
      box([0.6, 0.75, 0.04], [0.22, 0.38, 0.09], C.bleu, 0.01, [-0.16, 0, 0]),
      box([0.48, 0.63, 0.02], [0.22, 0.38, 0.115], C.cream, 0.005, [-0.16, 0, 0]),
      box([0.5, 0.4, 0.04], [-0.05, 0.21, 0.17], C.kraft, 0.01, [-0.2, 0, 0]),
    ],
  },
  {
    id: 'tele',
    label: 'Téléviseur',
    kind: 'box',
    position: [2.2, -2.02],
    baseY: 0.86,
    yaw: 0.12,
    footprint: null,
    order: 21,
    parts: [box([0.62, 0.46, 0.46], [0, 0.23, 0], C.grey, 0.05), box([0.5, 0.36, 0.02], [0, 0.24, 0.235], C.screen, 0.02)],
  },
  {
    id: 'armoire',
    label: 'Armoire',
    kind: 'furniture',
    position: [-2.2, -1.95],
    baseY: 0,
    yaw: 0,
    footprint: [1.1, 0.6],
    order: 22,
    parts: [
      box([1.04, 0.1, 0.54], [0, 0.05, 0], C.woodDark, 0.01),
      box([1.1, 1.86, 0.6], [0, 1.03, 0], C.wood, 0.03),
      box([0.52, 1.7, 0.03], [-0.27, 1.03, 0.31], C.woodLight, 0.01),
      box([0.52, 1.7, 0.03], [0.27, 1.03, 0.31], C.woodLight, 0.01),
      box([0.03, 0.22, 0.04], [-0.04, 1.08, 0.34], C.metal, 0.01),
      box([0.03, 0.22, 0.04], [0.04, 1.08, 0.34], C.metal, 0.01),
      box([1.16, 0.06, 0.64], [0, 1.98, 0], C.woodDark, 0.015),
    ],
  },
  {
    id: 'carton-c2',
    label: 'Carton',
    kind: 'box',
    position: [1.85, -1.15],
    baseY: 0,
    yaw: -0.3,
    footprint: [0.56, 0.5],
    order: 23,
    parts: carton(0.56, 0.44, 0.5),
  },
  {
    id: 'commode',
    label: 'Commode',
    kind: 'furniture',
    position: [2.25, -2.07],
    baseY: 0,
    yaw: 0,
    footprint: [1.2, 0.5],
    order: 24,
    parts: [
      ...legs(0.55, 0.2, 0.08, 0.05, C.woodDark),
      box([1.2, 0.78, 0.5], [0, 0.47, 0], C.walnut, 0.03),
      ...[0.26, 0.48, 0.7].flatMap((y): RoomPart[] => [
        box([1.1, 0.19, 0.02], [0, y, 0.255], C.wood, 0.01),
        sphere(0.025, [-0.3, y, 0.275], C.cream),
        sphere(0.025, [0.3, y, 0.275], C.cream),
      ]),
    ],
  },
  {
    id: 'frigo',
    label: 'Réfrigérateur',
    kind: 'furniture',
    position: [2.6, -0.75],
    baseY: 0,
    yaw: -Math.PI / 2,
    footprint: [0.62, 0.62],
    order: 25,
    parts: [
      box([0.62, 1.58, 0.62], [0, 0.81, 0], C.white, 0.05),
      box([0.6, 0.015, 0.02], [0, 1.12, 0.315], C.seam, 0.005),
      box([0.03, 0.3, 0.04], [0.24, 1.35, 0.33], C.metal, 0.01),
      box([0.03, 0.3, 0.04], [0.24, 0.8, 0.33], C.metal, 0.01),
    ],
  },
  {
    id: 'temoin',
    label: 'Le carton témoin',
    kind: 'box',
    position: [0.45, 0.6],
    baseY: 0,
    yaw: -0.35,
    footprint: null,
    order: 99,
    witness: true,
    parts: carton(0.6, 0.48, 0.5, C.kraft, true),
  },
]
