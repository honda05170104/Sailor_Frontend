const LIFF_ID = import.meta.env.VITE_LIFF_ID?.trim() || ''
const LINE_AUTO_LOGIN_SUPPRESSED_KEY = 'liff_login_attempt'

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

/**
 * Any browser inside the LINE app, LIFF or not. liff.isInClient() only matches
 * the LIFF browser, and without liff.init() it misses plain LINE links.
 */
export function isInLineApp() {
  return !isLocalHost() && isLineAppBrowser()
}

/** Stop the next automatic LINE login, which would bounce back to the other browser. */
export function suppressLineAutoLogin() {
  sessionStorage.setItem(LINE_AUTO_LOGIN_SUPPRESSED_KEY, '1')
}

export function shouldAutoLineLogin() {
  return isInLineApp() && sessionStorage.getItem(LINE_AUTO_LOGIN_SUPPRESSED_KEY) !== '1'
}
