/**
 * Serveur statique du build (dist/client), fidèle à un hébergeur statique
 * configuré en « URL propres » : /contact → contact/index.html, fichier
 * introuvable → 404.html avec le code 404. (`vite preview` renvoie l'accueil
 * pour toute URL inconnue, ce qui fausse l'hydratation des pages.)
 *
 * Usage : node scripts/serve.mjs [port]   (4173 par défaut)
 */
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../dist/client/', import.meta.url))
const port = Number(process.argv[2] ?? process.env.PORT ?? 4173)
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.data': 'text/x-script',
}

/** Fichier à servir pour un chemin, ou `null`. */
function resolve(pathname) {
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '')
  const target = join(root, safe)
  if (!target.startsWith(root)) return null
  if (existsSync(target) && statSync(target).isFile()) return target
  const index = join(target, 'index.html')
  return existsSync(index) ? index : null
}

createServer((request, response) => {
  const { pathname } = new URL(request.url ?? '/', 'http://localhost')
  const file = resolve(pathname)
  const status = file ? 200 : 404
  const served = file ?? join(root, '404.html')
  if (!existsSync(served)) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('404 — lancer npm run build')
    return
  }
  response.writeHead(status, {
    'Content-Type': TYPES[extname(served)] ?? 'application/octet-stream',
    'Cache-Control': served.includes('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
  })
  createReadStream(served).pipe(response)
}).listen(port, () => console.log(`Build servi sur http://localhost:${port}`))
