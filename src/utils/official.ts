/** Public official-site pages: no login, no LIFF, no member UI. */
export const OFFICIAL_PATHS = ['/store', '/vip', '/species/veiled-chameleon']

export function isOfficialPath(pathname: string) {
  return OFFICIAL_PATHS.includes(pathname)
}
