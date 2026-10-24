import { DOOR_INSIDE, DOOR_OUTSIDE, ROOM } from '../data/room'
import type { RoomItem } from '../types/room'
import { clamp, easeInOutCubic, lerp, range, smoothstep } from './math'

/*
 * Mouvements des objets de la pièce : uniquement des fonctions pures de la
 * progression (scroll) ou du temps (intro). Une même valeur donne toujours la
 * même pose : remonter la page rejoue exactement le débarras à l'envers.
 */

/** Pose d'un objet, réutilisée d'une frame à l'autre (aucune allocation par frame). */
export interface ItemPose {
  x: number
  y: number
  z: number
  /** Rotations locales (inclinaison), puis lacet (`yaw`) — ordre Euler « YXZ ». */
  rotX: number
  yaw: number
  rotZ: number
  visible: boolean
}

/** Trajet précalculé d'un objet, de sa place jusqu'au couloir. */
export interface ItemPlan {
  item: RoomItem
  /** Fenêtre de départ dans la progression globale `clear` (0 → 1). */
  start: number
  end: number
  /** Lacet au passage de la porte : le plus petit côté face à l'ouverture. */
  doorYaw: number
  /** Point de contrôle de la courbe de Bézier vers la porte (x, z). */
  control: readonly [number, number]
  /** Hauteur de levée (m) et de l'arc du trajet (m). */
  lift: number
  arc: number
  /** Inclinaison « sur un coin » des meubles portés (rad). */
  tilt: number
  /** Tour sur lui-même des petits objets pendant le vol (rad). */
  spin: number
  /** Délai de chute dans l'intro (s). */
  introDelay: number
}

/** Durée d'un trajet, en part de la progression `clear`. */
const TRIP = 0.2
/** Intro : écart entre deux chutes, durée de la chute et du rebond (s). */
const INTRO_STAGGER = 0.042
const FALL_TIME = 0.46
const BOUNCE_TIME = 0.28
const DROP_HEIGHT = 2.8

/**
 * Prépare les trajets des objets affichés : fenêtres de départ réparties
 * dans l'ordre (`order`), orientation au passage de la porte, arc selon la
 * famille d'objet, et ordre de chute de l'intro (les gros meubles au sol
 * d'abord, puis ce qui s'empile dessus, puis les petits objets).
 */
export function planItems(items: readonly RoomItem[]): ItemPlan[] {
  const leaving = items.filter((item) => !item.witness).sort((a, b) => a.order - b.order)
  const span = 1 - TRIP
  const startOf = new Map(leaving.map((item, k) => [item.id, leaving.length > 1 ? (k / (leaving.length - 1)) * span : 0]))

  const dropOrder = [...items].sort((a, b) => {
    if (a.baseY !== b.baseY) return a.baseY - b.baseY
    const area = (item: RoomItem) => (item.footprint ? item.footprint[0] * item.footprint[1] : 0.1)
    return area(b) - area(a)
  })
  const dropRank = new Map(dropOrder.map((item, k) => [item.id, k]))

  return items.map((item) => {
    const start = startOf.get(item.id) ?? 2
    const [x, z] = item.position
    // Le plus petit côté doit passer face à la porte (axe z) : lacet ≡ 0 ou π/2 (mod π), au plus proche du lacet actuel.
    const [w, d] = item.footprint ?? [0.5, 0.5]
    const preferred = d <= w ? 0 : Math.PI / 2
    const doorYaw = preferred + Math.round((item.yaw - preferred) / Math.PI) * Math.PI
    return {
      item,
      start,
      end: start + TRIP,
      doorYaw,
      // Courbe qui passe un peu vers l'avant de la pièce (là où la place est déjà faite)
      control: [lerp(x, DOOR_INSIDE[0], 0.5), Math.min(lerp(z, DOOR_INSIDE[1], 0.5) + 0.7, ROOM.halfDepth - 0.4)],
      lift: item.kind === 'furniture' ? 0.1 : item.kind === 'box' ? 0.18 : 0.25,
      arc: item.kind === 'furniture' ? 0.04 : item.kind === 'box' ? 0.42 : 0.85,
      tilt: item.kind === 'furniture' ? 0.13 : 0,
      spin: item.kind === 'small' ? ((dropRank.get(item.id) ?? 0) % 2 ? 1 : -1) * 1.1 : 0,
      introDelay: (dropRank.get(item.id) ?? 0) * INTRO_STAGGER,
    }
  })
}

/** Durée totale de l'intro (s), pour savoir quand arrêter d'actualiser les ombres. */
export function introDuration(plans: readonly ItemPlan[]): number {
  return plans.reduce((max, plan) => Math.max(max, plan.introDelay), 0) + FALL_TIME + BOUNCE_TIME
}

/** Progression du trajet d'un objet (0 = à sa place, 1 = sorti) pour une progression globale `clear`. */
export const tripProgress = (plan: ItemPlan, clear: number): number => range(clear, plan.start, plan.end)

/**
 * Pose d'un objet pendant le débarras, pour `t` ∈ [0, 1] :
 * levée (0 → 0,14), trajet en courbe jusqu'à la porte avec rotation pour
 * passer (0,1 → 0,78), puis franchissement de la porte (0,74 → 1).
 * Les meubles sont portés bas, inclinés sur un coin, avec le petit balancement
 * des pas des déménageurs ; les cartons et petits objets décrivent un arc.
 */
export function carryPose(plan: ItemPlan, t: number, out: ItemPose): ItemPose {
  const { item } = plan
  const [x0, z0] = item.position
  out.visible = t < 1
  if (t <= 0) {
    out.x = x0
    out.y = item.baseY
    out.z = z0
    out.rotX = 0
    out.yaw = item.yaw
    out.rotZ = 0
    return out
  }

  const lift = smoothstep(0, 0.14, t)
  const travel = easeInOutCubic(range(t, 0.1, 0.78))
  const exit = smoothstep(0.74, 1, t)

  // Courbe de Bézier quadratique : place → contrôle → devant la porte
  const u = 1 - travel
  const [cx, cz] = plan.control
  const bx = u * u * x0 + 2 * u * travel * cx + travel * travel * DOOR_INSIDE[0]
  const bz = u * u * z0 + 2 * u * travel * cz + travel * travel * DOOR_INSIDE[1]

  out.x = lerp(bx, DOOR_OUTSIDE[0], exit)
  out.z = lerp(bz, DOOR_OUTSIDE[1], exit)

  const steps = plan.tilt > 0 ? Math.abs(Math.sin(travel * Math.PI * 7)) * 0.035 * lift : 0
  out.y = lerp(item.baseY, 0, travel) + plan.lift * lift + plan.arc * Math.sin(Math.PI * travel) * (1 - exit) + steps

  const spin = plan.spin * Math.sin(Math.PI * travel)
  out.yaw = lerp(item.yaw, plan.doorYaw, smoothstep(0.15, 0.7, t)) + spin
  out.rotZ = plan.tilt * lift * (1 - exit * 0.6)
  out.rotX = item.kind === 'box' ? -0.08 * Math.sin(Math.PI * travel) : 0
  return out
}

/**
 * Décalage de l'intro pour un objet, `elapsed` secondes après le top départ :
 * il tombe dans la pièce (chute accélérée), rebondit à peine et se pose.
 * Renvoie `null` avant sa chute (objet encore invisible).
 */
export function introOffset(plan: ItemPlan, elapsed: number): { dy: number; wobble: number } | null {
  const local = elapsed - plan.introDelay
  if (local < 0) return null
  const fall = clamp(local / FALL_TIME)
  if (fall < 1) return { dy: (DROP_HEIGHT + plan.item.baseY * 0.5) * (1 - fall * fall), wobble: 0 }
  const bounce = clamp((local - FALL_TIME) / BOUNCE_TIME)
  const damping = Math.sin(Math.PI * bounce) * (1 - bounce)
  return { dy: 0.06 * damping, wobble: 0.05 * damping }
}

/**
 * Opacité de l'empreinte en pointillés laissée au sol par un objet : elle
 * apparaît quand il est soulevé, reste pendant que la pièce se vide (on voit
 * la carte de tout ce qui était là), puis toutes s'effacent quand la lumière revient.
 */
export function footprintOpacity(plan: ItemPlan, clear: number, light: number): number {
  return smoothstep(0.03, 0.2, tripProgress(plan, clear)) * (1 - smoothstep(0.1, 0.8, light))
}
