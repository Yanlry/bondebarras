import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Links, Meta, Outlet, Scripts, isRouteErrorResponse, useLocation, useRouteError } from 'react-router'
// Polices auto-hébergées (aucun appel à Google Fonts)
import '@fontsource-variable/bricolage-grotesque/index.css'
import '@fontsource-variable/instrument-sans/index.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-500.css'
import './index.css'
import { TraceCursor } from './components/Cursor'
import { Header } from './components/Header'
import { MobileActionBar } from './components/MobileActionBar'
import { PageTransition } from './components/PageTransition'
import { Preloader } from './components/Preloader'
import { SkipLinks } from './components/SkipLinks'
import { QUOTE_PATH } from './data/navigation'
import { useIntroStarted } from './hooks/useIntro'
import { usePageChange } from './hooks/usePageChange'
import { intro } from './lib/intro'
import { normalizePath } from './lib/links'
import { Footer } from './sections/Footer'

/**
 * Document HTML de toutes les pages (pré-rendu au build, puis hydraté).
 * Le petit script ajoute la classe `js` avant tout affichage : sans JavaScript,
 * aucune animation ne masque de contenu (voir la variante `scene:` et `[data-intro]`).
 */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#2346A0" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

/**
 * Coque commune : écran de chargement (seulement si la visite commence par
 * l'accueil, où il attend la 3D), liens d'évitement, en-tête, page, pied de
 * page, barre d'actions mobile, transition entre pages.
 */
export default function App() {
  const pathname = normalizePath(useLocation().pathname)
  // Figé au premier rendu : identique au pré-rendu et à l'hydratation.
  const [withPreloader] = useState(() => pathname === '/')
  const started = useIntroStarted()
  const announcer = useRef<HTMLParagraphElement>(null)
  usePageChange(announcer)

  // Visite commencée ailleurs que sur l'accueil : rien à attendre, l'intro de la pièce jouera à l'arrivée.
  useEffect(() => {
    if (withPreloader) return
    intro.markSceneReady()
    intro.start()
  }, [withPreloader])

  // Développement : la page de capture de la pièce s'affiche seule (images de secours).
  if (import.meta.env.DEV && pathname === '/__capture') return <Outlet />

  const onQuote = pathname === QUOTE_PATH
  return (
    <>
      {withPreloader && <Preloader />}
      <SkipLinks
        links={[
          { label: 'Aller au contenu', href: '#contenu' },
          onQuote ? { label: 'Aller au formulaire', href: '#devis-formulaire' } : { label: 'Demander un devis', href: QUOTE_PATH },
        ]}
      />
      <TraceCursor />
      <Header play={started} animateIn={withPreloader} />
      <main id="contenu">
        <Outlet />
      </main>
      <Footer />
      <MobileActionBar />
      <PageTransition />
      <p ref={announcer} aria-live="polite" className="sr-only" />
    </>
  )
}

/** Page affichée si une page plante (ou une erreur de route inattendue). */
export function ErrorBoundary() {
  const error = useRouteError()
  const title = isRouteErrorResponse(error) && error.status === 404 ? 'Page introuvable' : 'Une erreur est survenue'
  return (
    <main id="contenu" className="mx-auto max-w-3xl px-5 py-32">
      <h1 className="font-display text-4xl font-extrabold text-ink">{title}</h1>
      <p className="mt-4 text-ink-soft">
        Vous pouvez revenir à <a href="/" className="font-semibold text-bleu underline">l’accueil</a> ou nous appeler au{' '}
        <a href="tel:+33662832657" className="font-semibold text-bleu underline">
          06 62 83 26 57
        </a>
        .
      </p>
    </main>
  )
}

/** Chemins non pré-rendus (repli SPA) : affiché le temps que le JavaScript prenne le relais. */
export function HydrateFallback() {
  return <p className="sr-only">Chargement…</p>
}
