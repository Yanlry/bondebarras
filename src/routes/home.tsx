import { MotionConfig } from 'framer-motion'
import type { MetaFunction } from 'react-router'
import { organizationLd, pageMeta } from '../lib/seo'
import { Quote } from '../sections/Quote'
import { RoomStory } from '../sections/RoomStory'
import { Services } from '../sections/Services'

export const meta: MetaFunction = () => pageMeta('accueil', [organizationLd()])

/**
 * Accueil : le scrollytelling (scènes 0 à 3 réalisées). Les sections
 * « Prestations » et « Devis » restent en version provisoire jusqu'à ce que les
 * scènes 4 (le plan) et 8 (la porte) les remplacent.
 *
 * Framer Motion n'est utilisé que sur l'accueil (titre qui se range, textes du
 * hero) : `MotionConfig reducedMotion="user"` coupe ses mouvements si
 * l'utilisateur l'a demandé à son système.
 */
export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <RoomStory />
      <Services />
      <Quote />
    </MotionConfig>
  )
}
