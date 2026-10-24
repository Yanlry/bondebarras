/**
 * Concatène des classes CSS en ignorant les valeurs falsy (mini `clsx`).
 *
 * @example cn('btn', isActive && 'btn--active') // "btn btn--active"
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
