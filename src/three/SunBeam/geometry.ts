import { BufferGeometry, Float32BufferAttribute } from 'three'
import { ROOM, WINDOW } from '../../data/room'

/** Direction du soleil (par mètre parcouru vers l'avant, en z) : il descend et dérive vers la gauche. */
const SUN = { dx: -0.25, dy: -0.62 } as const

/** Projette un point de la fenêtre sur le sol, le long du rayon de soleil. */
function toFloor(x: number, y: number): [number, number, number] {
  const s = y / -SUN.dy
  return [x + SUN.dx * s, 0.012, -ROOM.halfDepth + s]
}

/**
 * Volume du rayon de soleil, de la fenêtre au sol : 4 faces, opacité forte
 * côté fenêtre et faible côté sol. La tache d'arrivée tombe sur le carton
 * témoin, seul objet qui reste à la fin.
 */
export function createBeamGeometry(): BufferGeometry {
  const { x0, x1, y0, y1 } = WINDOW
  const z = -ROOM.halfDepth + 0.02
  const w00 = [x0, y0, z]
  const w10 = [x1, y0, z]
  const w11 = [x1, y1, z]
  const w01 = [x0, y1, z]
  const f00 = toFloor(x0, y0)
  const f10 = toFloor(x1, y0)
  const f11 = toFloor(x1, y1)
  const f01 = toFloor(x0, y1)
  const faces = [
    [w00, w01, f01, f00],
    [w10, w11, f11, f10],
    [w01, w11, f11, f01],
    [w00, w10, f10, f00],
  ]
  const positions: number[] = []
  const alphas: number[] = []
  const index: number[] = []
  faces.forEach((quad, q) => {
    quad.forEach((vertex, v) => {
      positions.push(...vertex)
      alphas.push(v < 2 ? 0.34 : 0.05)
    })
    const o = q * 4
    index.push(o, o + 1, o + 2, o, o + 2, o + 3)
  })
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('aAlpha', new Float32BufferAttribute(alphas, 1))
  geometry.setIndex(index)
  return geometry
}

/** Tache de soleil au sol (quadrilatère projeté de la fenêtre), avec UV pour adoucir les bords. */
export function createPatchGeometry(): BufferGeometry {
  const { x0, x1, y0, y1 } = WINDOW
  const corners = [toFloor(x0, y0), toFloor(x1, y0), toFloor(x1, y1), toFloor(x0, y1)]
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(corners.flat(), 3))
  geometry.setAttribute('uv', new Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2))
  geometry.setAttribute('aAlpha', new Float32BufferAttribute([0.7, 0.7, 0.7, 0.7], 1))
  geometry.setIndex([0, 2, 1, 0, 3, 2])
  return geometry
}

/** Point du volume du rayon : `s` de la fenêtre (0) au sol (1), `u` / `v` en travers. */
export function pointInBeam(u: number, v: number, s: number): [number, number, number] {
  const { x0, x1, y0, y1 } = WINDOW
  const x = x0 + (x1 - x0) * u
  const y = y0 + (y1 - y0) * v
  const floor = toFloor(x, y)
  const z = -ROOM.halfDepth + 0.05
  return [x + (floor[0] - x) * s, y + (floor[1] - y) * s, z + (floor[2] - z) * s]
}
