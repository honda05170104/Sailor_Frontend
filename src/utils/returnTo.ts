const RETURN_TO_KEY = 'auth_return_to'

function sanitizeReturnTo(path: string | null | undefined) {
  if (!path) return null

  const value = path.trim()
  if (!value.startsWith('/') || value.startsWith('//')) return null

  try {
    const url = new URL(value, window.location.origin)
    if (url.origin !== window.location.origin) return null
    if (url.pathname === '/login' || url.pathname === '/complete-profile') return null
    return url.pathname
  } catch {
    return null
  }
}

export function saveReturnTo(path: string | null | undefined) {
  const next = sanitizeReturnTo(path)
  if (!next) return
  sessionStorage.setItem(RETURN_TO_KEY, next)
}

export function peekReturnTo() {
  return sanitizeReturnTo(sessionStorage.getItem(RETURN_TO_KEY))
}

export function clearReturnTo() {
  sessionStorage.removeItem(RETURN_TO_KEY)
}

export function clearReturnToIfMatched(pathname: string) {
  if (peekReturnTo() === pathname) clearReturnTo()
}

export function getPostAuthPath(profileIncomplete: boolean) {
  if (profileIncomplete) return '/complete-profile'
  return peekReturnTo() || '/'
}
