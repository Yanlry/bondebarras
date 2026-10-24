import { MotionConfig } from 'framer-motion'
import { TraceCursor } from './components/Cursor'
import { Header } from './components/Header'
import { MobileActionBar } from './components/MobileActionBar'
import { Preloader } from './components/Preloader'
import { SkipLinks } from './components/SkipLinks'
import { QUOTE_ANCHOR } from './data/navigation'
import { useIntroStarted } from './hooks/useIntro'
import { Footer } from './sections/Footer'
import { Quote } from './sections/Quote'
import { RoomStory } from './sections/RoomStory'
import { Services } from './sections/Services'

const SKIP_LINKS = [
  { label: 'Aller au contenu', href: '#contenu' },
  { label: 'Aller au devis', href: QUOTE_ANCHOR },
] as const

/**
 * Page unique de Bon Débarras, racontée au scroll : la pièce pleine, le
 * débarras, puis (prototype) les prestations et le devis.
 *
 * `MotionConfig reducedMotion="user"` : Framer Motion coupe les mouvements si
 * l'utilisateur l'a demandé à son système.
 */
export default function App() {
  const started = useIntroStarted()

  return (
    <MotionConfig reducedMotion="user">
      <Preloader />
      <SkipLinks links={SKIP_LINKS} />
      <TraceCursor />
      <Header play={started} />
      <main id="contenu">
        <RoomStory />
        <Services />
        <Quote />
      </main>
      <Footer />
      <MobileActionBar />
    </MotionConfig>
  )
}
