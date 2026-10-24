import type { IconName, IconProps } from './types'

/** Tracés des icônes (repère 24 × 24, trait 2 px, extrémités arrondies). */
const PATHS: Record<IconName, string> = {
  phone:
    'M6.6 3.5h2.6l1.4 4.1-1.9 1.3a12 12 0 0 0 6.4 6.4l1.3-1.9 4.1 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z',
  arrow: 'M4 12h15M13 6l6 6-6 6',
  'arrow-down': 'M12 4v15M6 13l6 6 6-6',
  box: 'M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9ZM3.5 7.5 12 12l8.5-4.5M12 12v9M7.8 5.2l8.5 4.6',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  mail: 'M3.5 6.5h17v11h-17v-11Zm0 0L12 13l8.5-6.5',
  pin: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13.5V12l3 2',
}

/** Icône au trait, décorative (le texte du bouton ou du lien porte le sens). */
export function Icon({ name, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
