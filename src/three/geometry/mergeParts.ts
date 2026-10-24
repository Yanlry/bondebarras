import { BoxGeometry, BufferGeometry, Color, CylinderGeometry, Euler, Float32BufferAttribute, Matrix4, Quaternion, SphereGeometry, Vector3 } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { RoomPart } from '../../types/room'

const color = new Color()
const matrix = new Matrix4()
const quaternion = new Quaternion()
const euler = new Euler()
const position = new Vector3()
const scale = new Vector3()

/** Géométrie d'une pièce, centrée sur l'origine, avant placement. */
function partGeometry(part: RoomPart, detail: number): BufferGeometry {
  switch (part.shape) {
    case 'box': {
      const [w, h, d] = part.size
      const radius = Math.min(part.radius ?? 0, w / 2, h / 2, d / 2)
      return radius > 0.006 ? new RoundedBoxGeometry(w, h, d, 2, radius) : new BoxGeometry(w, h, d)
    }
    case 'cylinder':
      return new CylinderGeometry(part.radiusTop ?? part.radius, part.radius, part.height, Math.max(10, 18 * detail), 1)
    case 'sphere':
      return new SphereGeometry(part.radius, Math.max(10, Math.round(16 * detail)), Math.max(8, Math.round(12 * detail)))
  }
}

/**
 * Fusionne les pièces d'un objet en **une seule géométrie** à couleurs de
 * sommets : un objet = un maillage = un seul appel de dessin (et un seul dans
 * la passe d'ombre), quel que soit son nombre de pièces.
 *
 * @param parts Pièces dans le repère local de l'objet.
 * @param detail Finesse des formes rondes (1 = desktop, moins sur mobile).
 */
export function mergeParts(parts: readonly RoomPart[], detail = 1): BufferGeometry {
  const geometries = parts.map((part) => {
    // RoundedBoxGeometry n'est pas indexée : tout passe en non indexé pour fusionner.
    const source = partGeometry(part, detail)
    const geometry = source.index ? source.toNonIndexed() : source
    if (geometry !== source) source.dispose()
    geometry.deleteAttribute('uv')
    const sphereScale = part.shape === 'sphere' ? part.scale : undefined
    position.set(...part.position)
    quaternion.setFromEuler(euler.set(...(part.rotation ?? [0, 0, 0])))
    scale.set(...(sphereScale ?? [1, 1, 1]))
    geometry.applyMatrix4(matrix.compose(position, quaternion, scale))

    color.set(part.color)
    const count = geometry.getAttribute('position').count
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) color.toArray(colors, i * 3)
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
    return geometry
  })

  const merged = mergeGeometries(geometries, false)
  for (const geometry of geometries) geometry.dispose()
  if (!merged) throw new Error('mergeParts : fusion impossible (attributs incompatibles)')
  merged.computeBoundingBox()
  merged.computeBoundingSphere()
  return merged
}
