import type { PlanLayout } from '../components/PlanDecor/types'
import type { PageId } from '../types/site'

/**
 * Plans décoratifs des introductions de pages (socle). Positions en % du cadre :
 * chaque page a sa propre disposition d'empreintes, comme une pièce différente.
 */
export const planLayouts: Partial<Record<PageId, PlanLayout>> = {
  prestations: {
    footprints: [
      { x: 16, y: 18, w: 30, h: 22 },
      { x: 52, y: 18, w: 36, h: 14 },
      { x: 16, y: 48, w: 18, h: 30 },
      { x: 40, y: 46, w: 24, h: 18 },
      { x: 70, y: 40, w: 18, h: 26 },
    ],
    carton: { x: 46, y: 70, w: 12, h: 13 },
    label: 'Le plan complet',
  },
  'debarras-particuliers': {
    footprints: [
      { x: 16, y: 17, w: 26, h: 12 },
      { x: 18, y: 38, w: 14, h: 30 },
      { x: 50, y: 20, w: 34, h: 20 },
      { x: 62, y: 50, w: 22, h: 22 },
    ],
    carton: { x: 40, y: 56, w: 12, h: 13 },
    label: 'Salon · 1er étage',
  },
  'debarras-succession': {
    footprints: [
      { x: 20, y: 20, w: 22, h: 26 },
      { x: 56, y: 18, w: 30, h: 12 },
    ],
    carton: { x: 62, y: 54, w: 13, h: 14 },
    label: 'À conserver',
  },
  'debarras-professionnels': {
    footprints: [
      { x: 18, y: 20, w: 16, h: 10 },
      { x: 40, y: 20, w: 16, h: 10 },
      { x: 62, y: 20, w: 16, h: 10 },
      { x: 18, y: 40, w: 16, h: 10 },
      { x: 40, y: 40, w: 16, h: 10 },
      { x: 62, y: 40, w: 16, h: 10 },
      { x: 18, y: 60, w: 38, h: 14 },
    ],
    carton: { x: 66, y: 62, w: 11, h: 12 },
    label: 'Plateau · bureaux',
  },
  'debarras-exterieur': {
    footprints: [
      { x: 18, y: 18, w: 28, h: 28 },
      { x: 56, y: 22, w: 26, h: 16 },
      { x: 52, y: 52, w: 30, h: 22 },
    ],
    carton: { x: 26, y: 60, w: 12, h: 13 },
    label: 'Parcelle · sur étude',
  },
  'tri-recyclage': {
    footprints: [
      { x: 16, y: 22, w: 20, h: 26 },
      { x: 42, y: 22, w: 20, h: 26 },
      { x: 68, y: 22, w: 20, h: 26 },
    ],
    carton: { x: 44, y: 60, w: 13, h: 14 },
    label: 'Réemploi · recyclage',
  },
  'debarras-cave-grenier-garage': {
    footprints: [
      { x: 16, y: 16, w: 16, h: 60 },
      { x: 38, y: 18, w: 26, h: 14 },
      { x: 38, y: 40, w: 14, h: 14 },
      { x: 70, y: 18, w: 16, h: 44 },
    ],
    carton: { x: 54, y: 62, w: 12, h: 13 },
    label: 'Sous-sol',
  },
  'syndrome-de-diogene': {
    footprints: [{ x: 22, y: 22, w: 56, h: 40 }],
    carton: { x: 60, y: 66, w: 12, h: 13 },
    label: 'Sans jugement',
  },
  introuvable: {
    footprints: [],
    carton: { x: 44, y: 44, w: 13, h: 14 },
    label: 'Déjà débarrassée',
  },
}
