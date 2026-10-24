import { useFrame } from '@react-three/fiber'
import { memo, useEffect, useMemo, useRef } from 'react'
import { BackSide, Color, MeshBasicMaterial, MeshStandardMaterial } from 'three'
import { DOOR, DOOR_Z, ROOM, WINDOW } from '../../data/room'
import type { Vec3 } from '../../types/geometry'
import type { RoomPart } from '../../types/room'
import { createFloorTexture } from '../geometry/floorTexture'
import { mergeParts } from '../geometry/mergeParts'
import type { RoomShellProps } from './types'

const WALL = '#EDE6D8'
const CUT = '#2346A0'
const PLINTH = '#F6F3EC'

/** Pavé de la coque, à partir de ses bornes [min, max] sur chaque axe. */
function slab(x: readonly [number, number], y: readonly [number, number], z: readonly [number, number], color: string): RoomPart {
  const size: Vec3 = [x[1] - x[0], y[1] - y[0], z[1] - z[0]]
  const position: Vec3 = [(x[0] + x[1]) / 2, (y[0] + y[1]) / 2, (z[0] + z[1]) / 2]
  return { shape: 'box', size, position, color }
}

/**
 * Les pièces de la coque : dalle et murs en coupe (tranche bleue, comme le
 * « poché » d'un plan d'architecte), plinthes, fenêtre et chambranle de porte.
 */
function shellParts(): RoomPart[] {
  const { halfWidth: hw, halfDepth: hd, wallHeight: h, wallThickness: t, slab: s } = ROOM
  const back = [-hd - t, -hd] as const
  const left = [-hw - t, -hw] as const
  const { x0, x1, y0, y1 } = WINDOW
  const { z0, z1, height: dh } = DOOR
  const frame = 0.06

  return [
    // Dalle (sa tranche est visible sur les côtés coupés)
    slab([-hw - t, hw], [-s, -0.002], [-hd - t, hd], CUT),
    // Mur du fond, percé de la fenêtre
    slab([-hw - t, x0], [0, h], back, WALL),
    slab([x1, hw], [0, h], back, WALL),
    slab([x0, x1], [0, y0], back, WALL),
    slab([x0, x1], [y1, h], back, WALL),
    // Mur de gauche, percé de la porte
    slab(left, [0, h], [-hd - t, z0], WALL),
    slab(left, [0, h], [z1, hd], WALL),
    slab(left, [dh, h], [z0, z1], WALL),
    // Tranches coupées : dessus des murs et chants avant
    slab([-hw - t, hw + 0.004], [h, h + 0.02], [-hd - t - 0.002, -hd + 0.002], CUT),
    slab([-hw - t - 0.002, -hw + 0.002], [h, h + 0.02], [-hd - t, hd + 0.004], CUT),
    slab([-hw - t - 0.002, -hw + 0.002], [-s, h + 0.02], [hd, hd + 0.018], CUT),
    slab([hw, hw + 0.018], [-s, h + 0.02], [-hd - t - 0.002, -hd + 0.002], CUT),
    // Plinthes
    slab([-hw, hw], [0, 0.09], [-hd, -hd + 0.02], PLINTH),
    slab([-hw, -hw + 0.02], [0, 0.09], [-hd, z0], PLINTH),
    slab([-hw, -hw + 0.02], [0, 0.09], [z1, hd], PLINTH),
    // Fenêtre : cadre, appui, petits bois
    slab([x0 - frame, x1 + frame], [y1, y1 + frame], [-hd - 0.01, -hd + 0.02], CUT),
    slab([x0 - 0.1, x1 + 0.1], [y0 - 0.05, y0], [-hd - 0.01, -hd + 0.12], CUT),
    slab([x0 - frame, x0], [y0, y1], [-hd - 0.01, -hd + 0.02], CUT),
    slab([x1, x1 + frame], [y0, y1], [-hd - 0.01, -hd + 0.02], CUT),
    slab([(x0 + x1) / 2 - 0.018, (x0 + x1) / 2 + 0.018], [y0, y1], [-hd - 0.09, -hd - 0.06], CUT),
    slab([x0, x1], [(y0 + y1) / 2 - 0.018, (y0 + y1) / 2 + 0.018], [-hd - 0.09, -hd - 0.06], CUT),
    // Chambranle de la porte
    slab([-hw, -hw + 0.03], [0, dh + 0.07], [z0 - 0.07, z0], CUT),
    slab([-hw, -hw + 0.03], [0, dh + 0.07], [z1, z1 + 0.07], CUT),
    slab([-hw, -hw + 0.03], [dh, dh + 0.07], [z0, z1], CUT),
  ]
}

/** Teintes du début (pièce encombrée, un peu terne) et de la fin (pièce vide et lumineuse). */
const DUSTY = new Color('#d9d2c6')
const CLEAN = new Color('#ffffff')
const FLOOR_DUSTY = new Color('#cfc3b1')

/**
 * Coque de la maquette : dalle, murs en coupe, fenêtre (lumière du dehors),
 * porte ouverte sur un couloir (les objets y disparaissent), parquet.
 * Les murs ne projettent pas d'ombre (inutile, la lumière vient de l'avant).
 * La pièce s'éclaircit avec `progress.light`.
 */
export const RoomShell = memo(function RoomShell({ progress, compact }: RoomShellProps) {
  const geometry = useMemo(() => mergeParts(shellParts()), [])
  const material = useMemo(() => new MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0 }), [])
  const floorTexture = useMemo(() => createFloorTexture(compact ? 512 : 1024), [compact])
  const floorMaterial = useMemo(() => new MeshStandardMaterial({ map: floorTexture, roughness: 0.82, metalness: 0 }), [floorTexture])
  const glowMaterial = useMemo(() => new MeshBasicMaterial({ color: '#FFF3DA', toneMapped: false }), [])
  const corridorMaterial = useMemo(() => new MeshStandardMaterial({ color: '#C9BFAE', roughness: 1, side: BackSide }), [])

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
      floorTexture.dispose()
      floorMaterial.dispose()
      glowMaterial.dispose()
      corridorMaterial.dispose()
    },
    [geometry, material, floorTexture, floorMaterial, glowMaterial, corridorMaterial],
  )

  const lastLight = useRef(-1)
  useFrame(() => {
    const light = progress.current.light
    if (light === lastLight.current) return
    lastLight.current = light
    material.color.lerpColors(DUSTY, CLEAN, light)
    floorMaterial.color.lerpColors(FLOOR_DUSTY, CLEAN, light)
  })

  const { halfWidth: hw, halfDepth: hd, wallThickness: t } = ROOM
  const { x0, x1, y0, y1 } = WINDOW

  return (
    <group>
      <mesh geometry={geometry} material={material} receiveShadow />
      <mesh material={floorMaterial} rotation-x={-Math.PI / 2} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[hw * 2, hd * 2]} />
      </mesh>
      {/* Lumière du dehors, derrière la fenêtre */}
      <mesh material={glowMaterial} position={[(x0 + x1) / 2, (y0 + y1) / 2, -hd - t - 0.01]}>
        <planeGeometry args={[x1 - x0, y1 - y0]} />
      </mesh>
      {/* Couloir derrière la porte : on n'en voit que l'intérieur */}
      <mesh material={corridorMaterial} position={[-hw - t - 0.4, 1.125, DOOR_Z]} receiveShadow>
        <boxGeometry args={[0.8, 2.25, DOOR.z1 - DOOR.z0 + 0.16]} />
      </mesh>
    </group>
  )
})
