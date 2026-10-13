import liff from '@line/liff'

const LIFF_ID = import.meta.env.VITE_LIFF_ID?.trim() || ''
const LIFF_LOGIN_ATTEMPT_KEY = 'liff_login_attempt'

function isLocalHost() {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
}

/** LINE in-app browser. An external browser opened from LINE does not match. */
export function isLineAppBrowser() {
  return /Line\/\d+\.\d+\.\d+/.test(window.navigator.userAgent)
}

function restoreLiffState() {
  const params = new URLSearchParams(window.location.search)
  const raw = params.get('liff.state')
  if (!raw) return

  let path = raw
  if (!path.startsWith('/')) {
    try {
      const decoded = decodeURIComponent(path)
      if (decoded.startsWith('/')) path = decoded
    } catch {
      return
    }
  }

  if (!path.startsWith('/') || path.startsWith('//')) return

  const next = new URL(path, window.location.origin)
  if (next.origin !== window.location.origin) return
  if (next.pathname === window.location.pathname) return

  window.history.replaceState(null, '', `${next.pathname}${next.search}${next.hash}`)
}

export async function initLiff() {
  if (!LIFF_ID) return

  // Do not call liff.init(). In the LIFF browser it redirects to
  // access.line.me without disable_auto_login, and opening that page in an
  // external browser relaunches the LINE app until login fails.
  restoreLiffState()
}

export function isLiffInClient() {
  if (!LIFF_ID || isLocalHost() || !isLineAppBrowser()) return false

  try {
    return liff.isInClient()
  } catch {
    return false
  }
}

/** Stop the next automatic liff.login(), which would bounce back to the other browser. */
export function suppressLiffLoginRedirect() {
  sessionStorage.setItem(LIFF_LOGIN_ATTEMPT_KEY, '1')
}

/** Inside the LIFF browser, return a LINE access token, or ask for web OAuth. */
export function consumeLiffAccessToken(): string | 'login' | 'outside' {
  if (!isLiffInClient()) return 'outside'

  try {
    if (!liff.isLoggedIn()) {
      if (sessionStorage.getItem(LIFF_LOGIN_ATTEMPT_KEY) === '1') return 'outside'
      // liff.login() builds an authorize URL without disable_auto_login.
      return 'login'
    }

    sessionStorage.removeItem(LIFF_LOGIN_ATTEMPT_KEY)
    return liff.getAccessToken() || 'login'
  } catch {
    return 'outside'
  }
}
