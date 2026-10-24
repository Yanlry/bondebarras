import { useFrame } from '@react-three/fiber'
import { memo, useEffect, useMemo, useRef } from 'react'
import { AdditiveBlending, IcosahedronGeometry, MeshBasicMaterial, Object3D, type InstancedMesh } from 'three'
import { seededRandom } from '../../lib/math'
import { pointInBeam } from '../SunBeam/geometry'
import type { DustMotesProps } from './types'

/** Un grain : position de repos dans le rayon et paramètres de sa dérive. */
interface Mote {
  base: [number, number, number]
  phase: number
  speed: number
  scale: number
}

const dummy = new Object3D()

/**
 * Poussière en suspension dans le rayon de soleil (un seul `InstancedMesh`) :
 * la pièce encombrée « respire » mal. Quand la lumière revient
 * (`progress.light`), la poussière se dissipe : l'air est propre.
 */
export const DustMotes = memo(function DustMotes({ progress, count, still }: DustMotesProps) {
  const mesh = useRef<InstancedMesh>(null)
  const geometry = useMemo(() => new IcosahedronGeometry(0.014, 0), [])
  const material = useMemo(
    () => new MeshBasicMaterial({ color: '#FFF4E0', transparent: true, opacity: 0.85, blending: AdditiveBlending, depthWrite: false, toneMapped: false }),
    [],
  )
  const motes = useMemo<Mote[]>(() => {
    const random = seededRandom(3)
    return Array.from({ length: count }, () => ({
      base: pointInBeam(random(), random(), 0.08 + random() * 0.85),
      phase: random() * Math.PI * 2,
      speed: 0.25 + random() * 0.5,
      scale: 0.6 + random() * 0.9,
    }))
  }, [count])

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  useFrame((state) => {
    const instances = mesh.current
    if (!instances) return
    const opacity = 1 - progress.current.light
    instances.visible = opacity > 0.01
    if (!instances.visible) return
    material.opacity = 0.85 * opacity
    const time = still ? 0 : state.clock.elapsedTime
    motes.forEach((mote, i) => {
      const drift = time * mote.speed + mote.phase
      dummy.position.set(
        mote.base[0] + Math.sin(drift) * 0.06,
        mote.base[1] + Math.sin(drift * 0.7 + 1.3) * 0.08,
        mote.base[2] + Math.cos(drift * 0.8) * 0.05,
      )
      dummy.scale.setScalar(mote.scale)
      dummy.updateMatrix()
      instances.setMatrixAt(i, dummy.matrix)
    })
    instances.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={mesh} args={[geometry, material, count]} frustumCulled={false} renderOrder={4} />
})
