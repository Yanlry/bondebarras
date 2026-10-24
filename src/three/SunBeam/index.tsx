import { useFrame } from '@react-three/fiber'
import { memo, useEffect, useMemo } from 'react'
import { lerp } from '../../lib/math'
import { createBeamMaterial } from '../materials/beamMaterial'
import { createBeamGeometry, createPatchGeometry } from './geometry'
import type { SunBeamProps } from './types'

/**
 * Rayon de soleil qui entre par la fenêtre et tache le sol. Il s'élargit en
 * intensité à mesure que la pièce se vide (`progress.light`) : la lumière
 * revient dans un espace libéré.
 */
export const SunBeam = memo(function SunBeam({ progress }: SunBeamProps) {
  const beamGeometry = useMemo(() => createBeamGeometry(), [])
  const patchGeometry = useMemo(() => createPatchGeometry(), [])
  const beamMaterial = useMemo(() => createBeamMaterial('#FFE2B0'), [])
  const patchMaterial = useMemo(() => createBeamMaterial('#FFD9A0', true), [])

  useEffect(
    () => () => {
      beamGeometry.dispose()
      patchGeometry.dispose()
      beamMaterial.dispose()
      patchMaterial.dispose()
    },
    [beamGeometry, patchGeometry, beamMaterial, patchMaterial],
  )

  useFrame(() => {
    const light = progress.current.light
    const beam = beamMaterial.uniforms.uIntensity
    const patch = patchMaterial.uniforms.uIntensity
    if (beam) beam.value = lerp(0.42, 0.62, light)
    if (patch) patch.value = lerp(0.32, 0.5, light)
  })

  return (
    <group>
      <mesh geometry={patchGeometry} material={patchMaterial} renderOrder={2} />
      <mesh geometry={beamGeometry} material={beamMaterial} renderOrder={3} />
    </group>
  )
})
