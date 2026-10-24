import { defineConfig, devices } from '@playwright/test'

/**
 * Tests de bout en bout sur le **build de production** (`npm run build` d'abord, Node ≥ 22.22).
 * Chromium utilise le GPU réel (Metal) : sans ces drapeaux, WebGL tourne en
 * logiciel (SwiftShader) et ne représente pas un vrai navigateur.
 * Captures enregistrées dans docs/screenshots/etape-N/ (voir tests/helpers.ts).
 */
export default defineConfig({
  testDir: 'tests',
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    launchOptions: { args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] },
  },
  webServer: {
    // Serveur statique fidèle à l'hébergement (URL propres, vraie page 404)
    command: 'node scripts/serve.mjs 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: [
    { name: 'desktop-1440', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'laptop-1280', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } } },
    {
      name: 'mobile-390',
      use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: devices['Pixel 7'].userAgent },
    },
    {
      name: 'mobile-375',
      use: { viewport: { width: 375, height: 667 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: devices['Pixel 7'].userAgent },
    },
  ],
})
