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
  menu: 'M4 7h16M4 12h16M4 17h10',
  close: 'm6 6 12 12M18 6 6 18',
  'chevron-down': 'm6 9 6 6 6-6',
  house: 'M3.5 11 12 4l8.5 7M6 9.5V20h12V9.5M10 20v-5.5h4V20',
  frame: 'M4.5 4.5h15v15h-15v-15Zm3 3h9v6l-3-2.5-3.5 3-2.5-2-0 4.5h0M9 9.5h.01',
  office: 'M4 20V5.5h10V20M14 9.5h6V20M3 20h18M7 9h1.5M10.5 9H12M7 12.5h1.5m2 0H12M7 16h1.5m2 0H12M17 13h.01M17 16.5h.01',
  leaf: 'M5 19c0-8 5-13 14-14-1 9-6 14-14 14Zm0 0 7-7',
  recycle: 'M8.5 6.5 10.5 3h3l2 3.5M17.5 9.5l2 3.5-1.5 2.6-4 .1M10 17.5H6l-1.5-2.6 2-3.4M13.5 6l2.5 1-1 2.5M15 18.5l-1.5 2 -1.5-2M6.5 11 4 10.5l1-2.5',
  stairs: 'M3.5 20.5h17v-17h-4v4h-4v4h-4v4h-5v5Z',
  door: 'M6 20.5V3.5h9.5v17M3.5 20.5h17M15.5 3.5l3 1.5v15.5M12.5 12h.01',
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
