import { useFrame } from '@react-three/fiber'
import { memo, useMemo } from 'react'
import { Vector3 } from 'three'
import type { SituationAnchorsProps } from './types'

const point = new Vector3()

/**
 * Relie les étiquettes HTML de « Vous vous reconnaissez ? » aux empreintes de la pièce : à chaque
 * frame, le point d'accroche 3D de chaque étiquette est projeté à l'écran et
 * son calque est déplacé (`translate3d` seul, aucun re-rendu React, et
 * seulement s'il a bougé d'au moins 0,1 px). La
 * projection tient compte du recadrage (`setViewOffset`) et du suivi de la souris.
 * Rien n'est calculé dans le hero (avant le cadrage).
 */
export const SituationAnchors = memo(function SituationAnchors({ situations, targets, progress }: SituationAnchorsProps) {
  const anchors = useMemo(() => situations.map((situation) => new Vector3(...situation.anchor)), [situations])
  // Dernière position écrite par calque : on n'écrit dans le DOM que si elle change vraiment.
  const written = useMemo(() => new Float32Array(situations.length * 2).fill(Number.NaN), [situations])

  useFrame((state) => {
    if (progress.current.focus < 0.02) return
    const { width, height } = state.size
    anchors.forEach((anchor, i) => {
      const element = targets.current[i]
      if (!element) return
      point.copy(anchor).project(state.camera)
      const x = (point.x * 0.5 + 0.5) * width
      const y = (-point.y * 0.5 + 0.5) * height
      if (Math.abs(x - (written[i * 2] ?? Number.NaN)) < 0.1 && Math.abs(y - (written[i * 2 + 1] ?? Number.NaN)) < 0.1) return
      written[i * 2] = x
      written[i * 2 + 1] = y
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
    })
  })

  return null
})
