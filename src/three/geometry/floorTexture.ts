import { CanvasTexture, SRGBColorSpace } from 'three'
import { seededRandom } from '../../lib/math'

/**
 * Parquet à lames, dessiné une fois dans un canvas 2D (aucune image à
 * télécharger). Lames de longueurs variées, deux tons de chêne clair et un
 * joint fin, comme sur une maquette d'architecte.
 *
 * @param size Côté de la texture en px (plus petit sur mobile).
 */
export function createFloorTexture(size = 1024): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) throw new Error('createFloorTexture : canvas 2D indisponible')

  const random = seededRandom(42)
  const tones = ['#dcc7a8', '#d5bf9e', '#e0ccaf', '#d1b996']
  const rows = 10
  const rowHeight = size / rows
  context.fillStyle = '#c4a984'
  context.fillRect(0, 0, size, size)

  for (let row = 0; row < rows; row++) {
    let x = -random() * size * 0.4
    while (x < size) {
      const length = size * (0.3 + random() * 0.35)
      context.fillStyle = tones[Math.floor(random() * tones.length)] ?? '#dcc7a8'
      context.fillRect(x + 1.5, row * rowHeight + 1.5, length - 3, rowHeight - 3)
      x += length
    }
  }

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  return texture
}
