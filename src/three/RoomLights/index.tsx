import { useFrame } from '@react-three/fiber'
import { memo, useRef } from 'react'
import type { HemisphereLight } from 'three'
import { lerp } from '../../lib/math'
import type { RoomLightsProps } from './types'

/**
 * Éclairage « studio » de la maquette : une lumière principale chaude venue
 * de l'avant-droite (ombres douces, carte d'ombre recalculée seulement quand
 * un objet bouge) et une lumière d'ambiance ciel / sol kraft qui s'intensifie
 * quand la pièce se vide.
 */
export const RoomLights = memo(function RoomLights({ progress, shadowSize }: RoomLightsProps) {
  const hemisphere = useRef<HemisphereLight>(null)

  useFrame(() => {
    if (hemisphere.current) hemisphere.current.intensity = lerp(1.25, 1.75, progress.current.light)
  })

  return (
    <>
      <hemisphereLight ref={hemisphere} args={['#FFF7EA', '#B89772', 1.25]} />
      <directionalLight
        position={[4.5, 8, 5.5]}
        intensity={2.1}
        color="#FFF1DC"
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.025}
        shadow-radius={4}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-near={2}
        shadow-camera-far={22}
      />
    </>
  )
})
