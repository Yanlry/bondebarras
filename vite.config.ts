import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  // Pré-optimise les dépendances chargées en différé (scène 3D) : évite un
  // rechargement « Outdated Optimize Dep » au premier passage en dev.
  optimizeDeps: {
    include: ['three', '@react-three/fiber', 'gsap', 'gsap/ScrollTrigger', '@gsap/react'],
  },
  build: {
    // Seul le chunk three.js / R3F dépasse 500 kB : il est chargé à la demande
    // par la scène 3D de l'accueil et ne bloque jamais le premier affichage.
    chunkSizeWarningLimit: 1000,
  },
})
