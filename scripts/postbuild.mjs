/**
 * Après le build :
 * - la page 404 pré-rendue (dist/client/404/index.html) est copiée en
 *   dist/client/404.html, nom attendu par la plupart des hébergeurs statiques ;
 * - le HTML pré-rendu est contrôlé (scripts/check-html.mjs) : le build échoue
 *   si une page perd son H1, son titre, sa description ou contient un lien cassé.
 */
import { copyFile } from 'node:fs/promises'

const client = new URL('../dist/client/', import.meta.url)
await copyFile(new URL('404/index.html', client), new URL('404.html', client))
console.log('✓ dist/client/404.html')
await import('./check-html.mjs')
