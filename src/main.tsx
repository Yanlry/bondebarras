import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
// Polices auto-hébergées (aucun appel à Google Fonts)
import '@fontsource-variable/bricolage-grotesque/index.css'
import '@fontsource-variable/instrument-sans/index.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-500.css'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')
if (!root) throw new Error('Élément #root introuvable')

// Développement uniquement : `?capture=avant|apres` affiche la pièce seule, pour
// générer les images de secours (`npm run capture:room`). Absent du build de production.
const capture = import.meta.env.DEV ? new URLSearchParams(window.location.search).get('capture') : null
const RoomCapture = import.meta.env.DEV ? lazy(() => import('./dev/RoomCapture')) : null

createRoot(root).render(
  <StrictMode>
    {RoomCapture && (capture === 'avant' || capture === 'apres') ? (
      <Suspense fallback={null}>
        <RoomCapture state={capture} />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
