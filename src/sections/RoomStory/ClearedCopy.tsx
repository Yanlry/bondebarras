import { memo } from 'react'
import { ActionLink } from '../../components/ActionLink'
import { QUOTE_PATH } from '../../data/navigation'
import { clearedCopy, roomImages } from '../../data/room-story'

/**
 * Fin de la scène : la pièce est vide, « Bon débarras. », et l'appel au devis.
 *
 * Mode animé : posé par-dessus la scène épinglée, révélé par la timeline. Seuls
 * ses éléments révélés reçoivent les clics (masqués, ils n'en reçoivent pas) :
 * le conteneur, lui, couvrirait sinon les boutons du hero.
 * Mode statique (état par défaut du DOM) : un bloc normal, accompagné de
 * l'image de la pièce vide (la 3D, elle, reste sur la pièce pleine du hero).
 */
export const ClearedCopy = memo(function ClearedCopy() {
  return (
    <div
      data-cleared
      aria-labelledby="place-nette-title"
      role="group"
      className="relative mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center scene:pointer-events-none scene:absolute scene:inset-0 scene:flex scene:max-w-none scene:flex-col scene:justify-end scene:p-0 scene:pb-[max(5svh,5.5rem)] scene:lg:items-start scene:lg:justify-center scene:lg:pb-0"
    >
      <div className="scene:mx-5 scene:*:pointer-events-auto scene:lg:mr-0 scene:lg:ml-[max(2rem,calc((100vw-80rem)/2+2rem))] scene:lg:w-[min(31vw,26rem)]">
        <p data-reveal className="tag-kraft">
          {clearedCopy.tag}
        </p>
        <h2
          id="place-nette-title"
          data-reveal
          className="mt-4 font-display text-[clamp(2.6rem,min(13vw,8.5svh),4.2rem)] leading-[0.92] font-extrabold tracking-[-0.045em] text-ink lg:text-[clamp(3.6rem,5.6vw,5.4rem)]"
        >
          {clearedCopy.title}
        </h2>
        <p data-reveal className="mt-3 max-w-[34ch] text-base text-ink-soft sm:text-lg lg:mt-5">
          {clearedCopy.text}
        </p>
        <div data-reveal className="mt-5 flex flex-wrap gap-3 lg:mt-7">
          <ActionLink href={QUOTE_PATH} size="lg" icon="arrow">
            Je fais de la place
          </ActionLink>
          <ActionLink href="/prestations" variant="ghost" size="lg" className="max-sm:[@media(max-height:760px)]:hidden">
            Nos prestations
          </ActionLink>
        </div>
      </div>

      {/* Mode statique : la pièce vide en image (en mode animé, c'est la 3D qui la montre) */}
      <figure className="footprint overflow-hidden bg-air-deep/60 scene:hidden">
        <img
          src={roomImages.after.src}
          alt={roomImages.after.alt}
          width={roomImages.width}
          height={roomImages.height}
          loading="lazy"
          decoding="async"
          className="h-auto w-full"
        />
      </figure>
    </div>
  )
})
