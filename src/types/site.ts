import type { Provisional } from './company'

/**
 * Statut de publication du site :
 * - `preview` : en préparation. Aucune page n'est indexable (`noindex`), robots.txt
 *   bloque l'exploration et le sitemap est vide ;
 * - `live` : publié. Seules les pages au statut `ready` sont indexables et listées.
 */
export type SiteStatus = 'preview' | 'live'

/** Réglages globaux du site. */
export interface Site {
  name: string
  /** URL publique (sans barre finale) : canonicals, Open Graph, sitemap. */
  url: Provisional<string>
  status: SiteStatus
  locale: string
}

/** Statut éditorial d'une page : `draft` tant que ses contenus ne sont pas validés. */
export type PageStatus = 'draft' | 'ready'

/** Identifiant d'une page du site. */
export type PageId =
  | 'accueil'
  | 'prestations'
  | 'debarras-particuliers'
  | 'debarras-succession'
  | 'debarras-professionnels'
  | 'debarras-exterieur'
  | 'tri-recyclage'
  | 'debarras-cave-grenier-garage'
  | 'syndrome-de-diogene'
  | 'entreprise'
  | 'devis'
  | 'contact'
  | 'mentions-legales'
  | 'confidentialite'
  | 'introuvable'

/** Métadonnées d'une page : source unique pour le pré-rendu, le sitemap et la navigation. */
export interface PageInfo {
  id: PageId
  /** Chemin, sans barre finale (sauf l'accueil). */
  path: `/${string}`
  /** Balise <title> (60 caractères au plus). */
  title: string
  /** Meta description (155 caractères au plus). */
  description: string
  /** Libellé court (fil d'Ariane, menus). */
  label: string
  /** Page parente dans le fil d'Ariane. */
  parent?: PageId
  status: PageStatus
}
