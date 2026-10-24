/** Borne `value` dans [min, max] (par défaut [0, 1]). */
export const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value))

/** Interpolation linéaire de `a` vers `b`. */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

/** Progression locale de `x` entre deux seuils, bornée dans [0, 1]. */
export const range = (x: number, start: number, end: number): number => clamp((x - start) / (end - start))

/** Transition douce (Hermite) entre deux seuils, comme en GLSL. */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = range(x, edge0, edge1)
  return t * t * (3 - 2 * t)
}

/** Décélération cubique : rapide au début, douce à la fin. */
export const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3

/** Accélération puis décélération (cubique). */
export const easeInOutCubic = (t: number): number => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)

/** Dépasse légèrement la cible avant de s'y poser (effet « posé »). */
export function easeOutBack(t: number, overshoot = 1.4): number {
  const c = overshoot + 1
  return 1 + c * (t - 1) ** 3 + overshoot * (t - 1) ** 2
}

/** Plus petit écart signé entre deux angles (radians), dans [-π, π]. */
export function angleDelta(a: number, b: number): number {
  const tau = Math.PI * 2
  let delta = (a - b) % tau
  if (delta > Math.PI) delta -= tau
  if (delta < -Math.PI) delta += tau
  return delta
}

/**
 * Amortissement exponentiel indépendant du framerate :
 * rapproche `current` de `target` à la vitesse `lambda` (≈ 1/s).
 */
export const damp = (current: number, target: number, lambda: number, dt: number): number =>
  lerp(current, target, 1 - Math.exp(-lambda * dt))

/** Générateur pseudo-aléatoire déterministe (mulberry32) : mêmes valeurs à chaque visite. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
