import { useFrame, useThree } from '@react-three/fiber'
import { memo, useEffect, useMemo, useRef } from 'react'
import { MeshStandardMaterial, Raycaster, Vector2, type Mesh } from 'three'
import { damp } from '../../lib/math'
import { carryPose, introDuration, introOffset, recallSum, tripProgress, type ItemPose } from '../../lib/roomMotion'
import { mergeParts } from '../geometry/mergeParts'
import type { RoomFurnitureProps } from './types'

/** Hauteur (m) dont se soulève l'objet survolé : « on va le prendre ». */
const HOVER_LIFT = 0.14

/**
 * Les objets de la pièce encombrée : un maillage fusionné par objet, un seul
 * matériau mat « argile » à couleurs de sommets.
 *
 * À chaque frame, la pose de chaque objet est **calculée** (jamais
 * accumulée) à partir du temps de l'intro et de la progression du scroll :
 * l'animation est donc parfaitement réversible. La carte d'ombre n'est
 * recalculée que si quelque chose a bougé.
 */
export const RoomFurniture = memo(function RoomFurniture({
  plans,
  progress,
  play,
  still,
  pointer,
  interactive,
  detail,
}: RoomFurnitureProps) {
  const gl = useThree((state) => state.gl)
  const camera = useThree((state) => state.camera)
  const geometries = useMemo(() => plans.map((plan) => mergeParts(plan.item.parts, detail)), [plans, detail])
  const material = useMemo(() => new MeshStandardMaterial({ vertexColors: true, roughness: 0.86, metalness: 0 }), [])
  const meshes = useRef<Array<Mesh | null>>([])
  const hover = useMemo(() => new Float32Array(plans.length), [plans])
  const hovered = useRef(-1)
  const playStart = useRef<number | null>(null)
  const lastPointer = useRef(-1)
  const lastClear = useRef(-1)
  const pose = useRef<ItemPose>({ x: 0, y: 0, z: 0, rotX: 0, yaw: 0, rotZ: 0, visible: true })
  const raycaster = useMemo(() => new Raycaster(), [])
  const ndc = useMemo(() => new Vector2(), [])
  const introEnd = useMemo(() => introDuration(plans), [plans])

  useEffect(
    () => () => {
      for (const geometry of geometries) geometry.dispose()
    },
    [geometries],
  )
  useEffect(() => () => material.dispose(), [material])

  /** Index de l'objet sous le pointeur (-1 si aucun). */
  const pick = (): number => {
    const state = pointer.current
    if (!state.inside) return -1
    const rect = gl.domElement.getBoundingClientRect()
    if (state.clientX < rect.left || state.clientX > rect.right || state.clientY < rect.top || state.clientY > rect.bottom) return -1
    ndc.set(((state.clientX - rect.left) / rect.width) * 2 - 1, -((state.clientY - rect.top) / rect.height) * 2 + 1)
    raycaster.setFromCamera(ndc, camera)
    const targets = meshes.current.filter((mesh): mesh is Mesh => Boolean(mesh?.visible))
    const hit = raycaster.intersectObjects(targets, false)[0]
    return hit ? Number(hit.object.userData.index) : -1
  }

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const now = state.clock.elapsedTime
    if (play && playStart.current === null) playStart.current = now
    const elapsed = still ? Number.POSITIVE_INFINITY : playStart.current === null ? -1 : now - playStart.current
    const { clear, focus, recall } = progress.current
    const motion = clear + recallSum(recall)
    let moving = (elapsed >= 0 && elapsed < introEnd + 0.1) || motion !== lastClear.current
    lastClear.current = motion

    // Survol : seulement dans le hero, une fois l'intro jouée, et si le pointeur a bougé.
    const canHover = interactive && !still && clear < 0.002 && focus < 0.25 && elapsed > introEnd
    let next = hovered.current
    if (!canHover) next = -1
    else if (pointer.current.version !== lastPointer.current) {
      lastPointer.current = pointer.current.version
      next = pick()
    }
    hovered.current = next

    const p = pose.current
    plans.forEach((plan, i) => {
      const mesh = meshes.current[i]
      if (!mesh) return
      const intro = elapsed === Number.POSITIVE_INFINITY ? { dy: 0, wobble: 0 } : elapsed < 0 ? null : introOffset(plan, elapsed)
      if (!intro) {
        mesh.visible = false
        return
      }
      carryPose(plan, tripProgress(plan, clear, recall[plan.item.id] ?? 0), p)

      const target = i === hovered.current ? 1 : 0
      const current = hover[i] ?? 0
      const lift = Math.abs(current - target) < 0.002 ? target : damp(current, target, 9, dt)
      if (lift !== current) moving = true
      hover[i] = lift

      mesh.visible = p.visible
      mesh.position.set(p.x, p.y + intro.dy + lift * HOVER_LIFT, p.z)
      mesh.rotation.set(p.rotX - lift * 0.05, p.yaw, p.rotZ + intro.wobble + lift * 0.035)
    })

    if (moving) gl.shadowMap.needsUpdate = true
  })

  return (
    <group>
      {plans.map((plan, i) => (
        <mesh
          key={plan.item.id}
          ref={(mesh) => {
            meshes.current[i] = mesh
            if (mesh) {
              mesh.rotation.order = 'YXZ'
              mesh.userData.index = i
            }
          }}
          geometry={geometries[i]}
          material={material}
          castShadow
          receiveShadow
          visible={false}
        />
      ))}
    </group>
  )
})
