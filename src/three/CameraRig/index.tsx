import { useFrame, useThree } from '@react-three/fiber'
import { memo, useEffect, useRef } from 'react'
import type { PerspectiveCamera } from 'three'
import { damp, lerp } from '../../lib/math'
import type { CameraRigProps } from './types'

/** Point visé : le centre de la pièce, un peu au-dessus du sol. */
const TARGET = { x: 0, y: 1.05, z: 0 } as const
/** Vue 3/4 de la maquette (radians) : azimut depuis l'avant, élévation. */
const VIEW = { azimuth: 0.66, elevation: 0.5 } as const
/** Pendant le débarras, la vue plonge un peu plus : on voit tout le sol se libérer. */
const FOCUS_VIEW = { azimuth: 0.58, elevation: 0.62 } as const
/** Demi-encombrement apparent de la maquette (m), horizontal et vertical. */
const EXTENT = { x: 4.15, y: 3.05 } as const
/** Amplitude du suivi de la souris (radians). */
const FOLLOW = { azimuth: 0.11, elevation: 0.05 } as const

/**
 * Caméra de la maquette : cadre la pièce dans l'emplacement CSS du hero, puis
 * glisse vers l'emplacement du débarras au scroll (`progress.focus`). Le
 * recentrage passe par `setViewOffset` (décalage de la projection) : la vue
 * reste en 3/4 quel que soit l'endroit de l'écran où la pièce est posée.
 *
 * Avec une souris, la caméra s'oriente légèrement vers le curseur ; sur
 * écran tactile, elle « respire » lentement.
 */
export const CameraRig = memo(function CameraRig({ heroSlot, focusSlot, progress, pointer, interactive, still }: CameraRigProps) {
  const camera = useThree((state) => state.camera) as PerspectiveCamera
  const invalidate = useThree((state) => state.invalidate)
  const follow = useRef({ x: 0, y: 0 })

  useEffect(() => {
    invalidate()
  }, [heroSlot, focusSlot, invalidate])

  useEffect(() => () => camera.clearViewOffset(), [camera])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const { width, height } = state.size
    const f = progress.current.focus

    // Emplacement courant de la pièce, entre le hero et le débarras
    const x = lerp(heroSlot.x, focusSlot.x, f)
    const y = lerp(heroSlot.y, focusSlot.y, f)
    const w = Math.max(1, lerp(heroSlot.width, focusSlot.width, f))
    const h = Math.max(1, lerp(heroSlot.height, focusSlot.height, f))

    // Suivi du curseur, ou respiration lente sur écran tactile
    const time = state.clock.elapsedTime
    const goalX = still ? 0 : interactive ? pointer.current.x : Math.sin(time * 0.35) * 0.45
    const goalY = still ? 0 : interactive ? pointer.current.y : Math.sin(time * 0.27 + 1) * 0.3
    follow.current.x = damp(follow.current.x, goalX * (1 - f * 0.6), 2.6, dt)
    follow.current.y = damp(follow.current.y, goalY * (1 - f * 0.6), 2.6, dt)

    const azimuth = lerp(VIEW.azimuth, FOCUS_VIEW.azimuth, f) + follow.current.x * FOLLOW.azimuth
    const elevation = lerp(VIEW.elevation, FOCUS_VIEW.elevation, f) + follow.current.y * FOLLOW.elevation

    // Distance pour que la maquette tienne dans l'emplacement (px par mètre identiques en x et y)
    const tanHalf = Math.tan((camera.fov * Math.PI) / 360)
    const distance = Math.max((EXTENT.x * height) / (w * tanHalf), (EXTENT.y * height) / (h * tanHalf))

    const cosE = Math.cos(elevation)
    camera.position.set(
      TARGET.x + Math.sin(azimuth) * cosE * distance,
      TARGET.y + Math.sin(elevation) * distance,
      TARGET.z + Math.cos(azimuth) * cosE * distance,
    )
    camera.lookAt(TARGET.x, TARGET.y, TARGET.z)
    camera.far = distance + 20
    camera.near = Math.max(0.5, distance - 12)
    // Le centre de la pièce s'affiche au centre de l'emplacement
    camera.setViewOffset(width, height, width / 2 - (x + w / 2), height / 2 - (y + h / 2), width, height)
  })

  return null
})
