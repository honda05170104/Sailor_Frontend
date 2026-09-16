/**
 * Sailor design system — color tokens
 *
 * Neutrals (black / white / glass) live alongside a small brand palette.
 * Prefer CSS variables from GlobalStyle in components:
 *   color: var(--color-primary)
 */

export const colors = {
  // Neutrals
  black: '#050505',
  blackDeep: '#000000',
  white: '#ffffff',
  muted: 'rgba(255, 255, 255, 0.48)',
  glass: 'rgba(255, 255, 255, 0.055)',
  glassStrong: 'rgba(255, 255, 255, 0.07)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',

  // Brand — 主色：鮮豔藍
  /** 主色：鮮豔藍（品牌唯一主色，選中／重點優先用這個） */
  primary: '#2f6bff',
  primarySoft: 'rgba(47, 107, 255, 0.22)',
  primaryStrong: '#1a4fff',

  /** 輔助色：珊瑚橙，僅 CTA／次要強調 */
  accent: '#ff8c42',
  accentSoft: 'rgba(255, 140, 66, 0.18)',

  /** 輔助色：靛紫，僅標籤／圖示底 */
  secondary: '#946eff',
  secondarySoft: 'rgba(148, 110, 255, 0.18)',

  /** 狀態 */
  success: '#6cc762',
  danger: '#ff453a',
  warning: '#f5c542',
} as const

export type ColorToken = keyof typeof colors

export const designSystem = {
  colors,
  fonts: {
    display: "'Syne', sans-serif",
    body: "'Figtree', sans-serif",
  },
  radius: {
    card: '1.5rem',
    pill: '999px',
    icon: '0.95rem',
  },
  blur: {
    glass: '22px',
  },
} as const

export default designSystem
