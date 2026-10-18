/** Public official-site pages: no login, no LIFF, no member UI. */
export const OFFICIAL_PATHS = ['/store', '/vip']

export function isOfficialPath(pathname: string) {
  return OFFICIAL_PATHS.includes(pathname)
}
