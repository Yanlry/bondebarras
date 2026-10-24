import { Canvas, useFrame } from '@react-three/fiber'
import { memo, useMemo, useRef } from 'react'
import { NeutralToneMapping, PCFShadowMap } from 'three'
import { ROOM_ITEMS } from '../../data/room'
import { planItems } from '../../lib/roomMotion'
import { CameraRig } from '../../three/CameraRig'
import { DustMotes } from '../../three/DustMotes'
import { Footprints } from '../../three/Footprints'
import { RoomFurniture } from '../../three/RoomFurniture'
import { RoomLights } from '../../three/RoomLights'
import { RoomShell } from '../../three/RoomShell'
import { SituationAnchors } from '../../three/SituationAnchors'
import { SunBeam } from '../../three/SunBeam'
import type { RoomSceneProps } from './types'

/** Signale la première image rendue, puis ne fait plus rien. */
function FirstFrame({ onReady }: { onReady?: () => void }) {
  const done = useRef(false)
  useFrame(() => {
    if (done.current) return
    done.current = true
    onReady?.()
  })
  return null
}

/**
 * Scène 3D de la pièce (chunk séparé, chargé à la demande) : la maquette en
 * coupe, ses objets, la lumière de la fenêtre, la poussière et les empreintes.
 *
 * - rendu en pause hors écran (`frameloop="never"`), à la demande en mode réduit ;
 * - résolution plafonnée (1,5× sur mobile, 1,75× sinon) ;
 * - mobile : 21 objets au lieu de 26, ombres et poussière allégées.
 */
export default memo(function RoomScene({
  heroSlot,
  focusSlot,
  progress,
  pointer,
  active,
  reducedMotion,
  compact,
  interactive,
  play,
  onReady,
  preserveDrawingBuffer = false,
  situations,
  situationTargets,
}: RoomSceneProps) {
  const plans = useMemo(() => planItems(ROOM_ITEMS.filter((item) => !compact || !item.desktopOnly)), [compact])

  return (
    <Canvas
      aria-hidden="true"
      className="!absolute inset-0"
      dpr={[1, compact ? 1.5 : 1.75]}
      shadows={{ type: PCFShadowMap }}
      camera={{ position: [10, 8, 12], fov: 24, near: 1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer }}
      frameloop={active ? (reducedMotion ? 'demand' : 'always') : 'never'}
      onCreated={({ gl }) => {
        // Tons de la marque fidèles ; ombres recalculées seulement quand un objet bouge.
        gl.toneMapping = NeutralToneMapping
        gl.shadowMap.autoUpdate = false
        gl.shadowMap.needsUpdate = true
      }}
    >
      <RoomLights progress={progress} shadowSize={compact ? 1024 : 2048} />
      <RoomShell progress={progress} compact={compact} />
      <RoomFurniture
        plans={plans}
        progress={progress}
        play={play}
        still={reducedMotion}
        pointer={pointer}
        interactive={interactive}
        detail={compact ? 0.7 : 1}
      />
      <Footprints plans={plans} progress={progress} />
      <SunBeam progress={progress} />
      <DustMotes progress={progress} count={compact ? 60 : 140} still={reducedMotion} />
      <CameraRig heroSlot={heroSlot} focusSlot={focusSlot} progress={progress} pointer={pointer} interactive={interactive} still={reducedMotion} />
      {situations && situationTargets && <SituationAnchors situations={situations} targets={situationTargets} progress={progress} />}
      <FirstFrame onReady={onReady} />
    </Canvas>
  )
})
