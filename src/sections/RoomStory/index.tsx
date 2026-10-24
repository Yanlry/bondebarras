import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { Icon } from '../../components/Icon'
import { useInViewport } from '../../hooks/useInViewport'
import { useIntroStarted } from '../../hooks/useIntro'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { usePointerRef } from '../../hooks/usePointerRef'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useRelativeRect } from '../../hooks/useRelativeRect'
import { useRoomScene } from '../../hooks/useRoomScene'
import { intro } from '../../lib/intro'
import { supportsWebGL } from '../../lib/webgl'
import { heroCopy, roomImages, roomSceneDescription } from '../../data/room-story'
import type { RoomProgress } from '../../types/room'
import { ClearedCopy } from './ClearedCopy'
import { ClearProgress } from './ClearProgress'
import { HeroCopy } from './HeroCopy'

/** Scène 3D chargée à la demande : three.js n'alourdit pas le premier affichage. */
const RoomScene = lazy(() => import('./RoomScene'))

/**
 * Scènes 1 et 3 du récit : « La pièce pleine » puis « Place nette ».
 *
 * Une section épinglée (CSS sticky, ~4,4 hauteurs d'écran) : le hero présente
 * l'entreprise devant une maquette 3D de pièce encombrée qui réagit à la
 * souris ; au scroll, la pièce glisse au centre et se vide objet par objet
 * (porte, empreintes, lumière), jusqu'à « Bon débarras. » et l'appel au devis.
 *
 * Mode statique (mouvement réduit, écran bas) : pas d'épinglage, le hero puis
 * le texte final avec l'image de la pièce vide. Sans WebGL : images avant / après.
 */
export function RoomStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const heroSlotRef = useRef<HTMLDivElement>(null)
  const focusSlotRef = useRef<HTMLDivElement>(null)
  const progress = useRef<RoomProgress>({ focus: 0, clear: 0, light: 0 })
  const heroSlot = useRelativeRect(heroSlotRef, layerRef)
  const focusSlot = useRelativeRect(focusSlotRef, layerRef)
  const pointer = usePointerRef()
  const reducedMotion = usePrefersReducedMotion()
  const compact = useMediaQuery('(max-width: 767px)')
  const interactive = useMediaQuery('(hover: hover) and (pointer: fine)')
  const inView = useInViewport(sectionRef, '120px', true)
  const started = useIntroStarted()
  const [webgl] = useState(supportsWebGL)
  const [failed, setFailed] = useState(false)
  const has3D = webgl && !failed

  useRoomScene({ trigger: sectionRef, progress, enabled: has3D })

  const handleReady = useCallback(() => intro.markSceneReady(), [])
  // La 3D a planté (pilote graphique…) : images de secours, et l'écran de chargement n'attend plus.
  const handleFailure = useCallback(() => {
    setFailed(true)
    intro.markSceneReady()
  }, [])


  // Sans WebGL, rien à attendre : l'écran de chargement peut se lever.
  useEffect(() => {
    if (!webgl) intro.markSceneReady()
  }, [webgl])

  return (
    <section
      ref={sectionRef}
      id="accueil"
      aria-labelledby="hero-title"
      data-scene={has3D ? '' : undefined}
      className="relative scene:h-[440svh]"
    >
      <p className="sr-only">{roomSceneDescription}</p>

      <div className="relative scene:sticky scene:top-0 scene:h-svh scene:overflow-clip">
        {/* Calque du hero : la maquette 3D le couvre entièrement (tout l'écran en mode animé) */}
        <div ref={layerRef} className="relative isolate scene:absolute scene:inset-0">
          {/* Fond : lumière douce derrière la maquette */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(90%_60%_at_50%_30%,#fffdf8_0%,#f6f3ec_55%,#ece6da_100%)] lg:bg-[radial-gradient(60%_75%_at_68%_48%,#fffdf8_0%,#f6f3ec_55%,#ece6da_100%)]"
          />

          {has3D && heroSlot && focusSlot && (
            <ErrorBoundary fallback={null} onError={handleFailure}>
              <Suspense fallback={null}>
                <RoomScene
                  heroSlot={heroSlot}
                  focusSlot={focusSlot}
                  progress={progress}
                  pointer={pointer}
                  active={inView}
                  reducedMotion={reducedMotion}
                  compact={compact}
                  interactive={interactive}
                  play={started}
                  onReady={handleReady}
                />
              </Suspense>
            </ErrorBoundary>
          )}

          {/* Emplacement de la pièce pendant le débarras (mesuré, jamais affiché) */}
          <div
            ref={focusSlotRef}
            aria-hidden="true"
            className="pointer-events-none invisible absolute inset-x-5 top-[13%] bottom-[37%] max-sm:[@media(max-height:760px)]:top-[11%] max-sm:[@media(max-height:760px)]:bottom-[47%] lg:inset-x-auto lg:top-[7%] lg:right-[1%] lg:bottom-[5%] lg:left-[37%]"
          />

          {/* Hero : une hauteur d'écran, texte et emplacement de la maquette */}
          <div className="relative mx-auto grid min-h-svh max-w-7xl grid-rows-[minmax(30svh,1fr)_auto] gap-y-2 px-5 pt-18 pb-14 sm:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:grid-rows-1 lg:items-center lg:gap-x-6 lg:pt-24 lg:pb-16 [@media(min-height:560px)]:h-svh">
            <div ref={heroSlotRef} className="relative row-start-1 min-h-[30svh] lg:col-start-2 lg:h-full lg:min-h-0">
              {/* Sans 3D : la pièce encombrée en image */}
              {!has3D && (
                <img
                  src={roomImages.before.src}
                  alt={roomImages.before.alt}
                  width={roomImages.width}
                  height={roomImages.height}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-contain"
                />
              )}
            </div>
            <div className="row-start-2 lg:col-start-1 lg:row-start-1">
              <HeroCopy play={started} />
            </div>
          </div>
        </div>

        <p
          data-scroll-cue
          aria-hidden="true"
          className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono whitespace-nowrap text-xs tracking-[0.16em] text-ink-soft uppercase scene:flex"
        >
          {heroCopy.scrollCue}
          <Icon name="arrow-down" className="scroll-cue-bob size-4 text-sangle-deep" />
        </p>

        <ClearProgress />
        <ClearedCopy />
      </div>
    </section>
  )
}
