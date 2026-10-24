import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/*
 * Point d'entrée unique de GSAP : les plugins sont enregistrés une seule fois
 * ici, et tout le projet importe gsap / ScrollTrigger / useGSAP depuis ce module.
 */
gsap.registerPlugin(ScrollTrigger, useGSAP)

// Sur mobile, la barre d'adresse qui se rétracte change la hauteur de la fenêtre :
// inutile de tout recalculer (et de faire sauter les scènes) à chaque fois.
ScrollTrigger.config({ ignoreMobileResize: true })

// Site raconté au scroll : à chaque (re)chargement, l'histoire repart du début.
// Passer par ScrollTrigger est indispensable : il mémorise et réapplique lui-même
// `history.scrollRestoration` après chaque recalcul. Les ancres (#devis…) restent respectées.
ScrollTrigger.clearScrollMemory('manual')
if (typeof window !== 'undefined' && !window.location.hash) window.scrollTo(0, 0)

// Les polices changent la hauteur des titres : on recalcule les positions une fois chargées.
if (typeof document !== 'undefined' && 'fonts' in document) {
  void document.fonts.ready.then(() => ScrollTrigger.refresh())
}

/**
 * Condition des « scènes au scroll » (sections épinglées et scrubbées) :
 * mouvement autorisé et écran assez haut pour un épinglage confortable.
 * Sinon, les sections défilent normalement et affichent leur état final.
 * Doit rester identique à la variante CSS `scene:` (index.css).
 */
export const SCROLL_SCENE_QUERY = '(prefers-reduced-motion: no-preference) and (min-height: 560px)'

/** Négation de {@link SCROLL_SCENE_QUERY}. */
export const STATIC_SCENE_QUERY = `not all and ${SCROLL_SCENE_QUERY}`

export { gsap, ScrollTrigger, useGSAP }
