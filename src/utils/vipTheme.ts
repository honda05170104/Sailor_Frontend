import type { VipTier } from './user'

export type VipThemeKey = 'bronze' | 'silver' | 'gold' | 'black'

export function resolveVipTheme(
  vip?: Pick<VipTier, 'slug' | 'name' | 'rank'> | null,
): VipThemeKey {
  const slug = vip?.slug?.trim().toLowerCase() ?? ''
  const name = vip?.name?.trim() ?? ''

  if (slug === 'bronze' || name.includes('銅') || name.includes('一般')) {
    return 'bronze'
  }
  if (
    slug === 'silver' ||
    slug === 'platinum' ||
    name.includes('銀') ||
    name.includes('白金')
  ) {
    return 'silver'
  }
  if (slug === 'black' || name.includes('黑')) {
    return 'black'
  }
  if (slug === 'gold' || name.includes('金')) {
    return 'gold'
  }

  const rank = vip?.rank ?? 1
  if (rank >= 4) return 'black'
  if (rank >= 3) return 'gold'
  if (rank === 2) return 'silver'
  return 'bronze'
}

export const VIP_PAGE_BG: Record<VipThemeKey, string> = {
  bronze: '#4a2410',
  silver: '#3a424c',
  gold: '#4a3608',
  black: '#141416',
}

export const VIP_TAG_BG: Record<VipThemeKey, string> = {
  bronze: '#7a3a10',
  silver: '#5c6572',
  gold: '#8a6e0c',
  black: '#000000',
}

export const VIP_TAG_COLOR: Record<VipThemeKey, string> = {
  bronze: '#ffffff',
  silver: '#ffffff',
  gold: '#ffffff',
  black: '#ffffff',
}
