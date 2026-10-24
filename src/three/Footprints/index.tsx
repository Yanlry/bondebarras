import { useFrame } from '@react-three/fiber'
import { memo, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { InstancedBufferAttribute, Object3D, PlaneGeometry, type InstancedMesh } from 'three'
import { footprintOpacity, recallSum } from '../../lib/roomMotion'
import { createFootprintMaterial } from '../materials/footprintMaterial'
import type { FootprintsProps } from './types'

const dummy = new Object3D()

/**
 * Empreintes en pointillés laissées au sol par les objets enlevés (motif
 * signature de Bon Débarras) : un seul `InstancedMesh` et un shader, quel que
 * soit le nombre d'objets. Seule l'opacité change au scroll.
 */
export const Footprints = memo(function Footprints({ plans, progress }: FootprintsProps) {
  const grounded = useMemo(() => plans.filter((plan) => plan.item.footprint && !plan.item.witness), [plans])
  const mesh = useRef<InstancedMesh>(null)
  const geometry = useMemo(() => {
    const plane = new PlaneGeometry(1, 1)
    plane.rotateX(-Math.PI / 2)
    plane.setAttribute('aSize', new InstancedBufferAttribute(new Float32Array(grounded.length * 2), 2))
    plane.setAttribute('aOpacity', new InstancedBufferAttribute(new Float32Array(grounded.length), 1))
    return plane
  }, [grounded.length])
  const material = useMemo(() => createFootprintMaterial('#2346A0'), [])

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  // Les empreintes ne bougent jamais : matrices et tailles posées une fois.
  useLayoutEffect(() => {
    const instances = mesh.current
    if (!instances) return
    const size = geometry.getAttribute('aSize') as InstancedBufferAttribute
    grounded.forEach((plan, i) => {
      const [w, d] = plan.item.footprint ?? [0, 0]
      const fw = w + 0.12
      const fd = d + 0.12
      dummy.position.set(plan.item.position[0], 0.006, plan.item.position[1])
      dummy.rotation.set(0, plan.item.yaw, 0)
      dummy.scale.set(fw, 1, fd)
      dummy.updateMatrix()
      instances.setMatrixAt(i, dummy.matrix)
      size.setXY(i, fw, fd)
    })
    instances.instanceMatrix.needsUpdate = true
    size.needsUpdate = true
  }, [grounded, geometry])

  const last = useRef({ clear: -1, light: -1 })
  useFrame(() => {
    const { clear, light, recall } = progress.current
    const motion = clear + recallSum(recall)
    if (motion === last.current.clear && light === last.current.light) return
    last.current.clear = motion
    last.current.light = light
    const opacity = geometry.getAttribute('aOpacity') as InstancedBufferAttribute
    let any = false
    grounded.forEach((plan, i) => {
      const value = footprintOpacity(plan, clear, light, recall[plan.item.id] ?? 0)
      opacity.setX(i, value)
      any ||= value > 0.005
    })
    opacity.needsUpdate = true
    if (mesh.current) mesh.current.visible = any
  })

  return <instancedMesh ref={mesh} args={[geometry, material, grounded.length]} visible={false} frustumCulled={false} renderOrder={1} />
})
