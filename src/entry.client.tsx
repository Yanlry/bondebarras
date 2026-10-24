import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'

/**
 * Entrée navigateur : reprise (hydratation) du HTML pré-rendu par React Router.
 * Toute différence entre le HTML pré-rendu et le premier rendu est signalée en
 * console avec la pile de composants (aussi en production) : les tests
 * Playwright échouent sur ce message.
 */
startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
    {
      onRecoverableError(error, info) {
        console.error('[hydratation]', error instanceof Error ? error.message : error, info.componentStack)
      },
    },
  )
})
