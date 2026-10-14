import liff from '@line/liff'

const LIFF_ID = import.meta.env.VITE_LIFF_ID?.trim() || ''
const LINE_AUTO_LOGIN_SUPPRESSED_KEY = 'liff_login_attempt'
const PUBLIC_PATHS = ['/store', '/vip']

let liffReady: Promise<void> | null = null

function isLocalHost() {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
}

/** LINE in-app browser. An external browser opened from LINE does not match. */
export function isLineAppBrowser() {
  return /Line\/\d+\.\d+\.\d+/.test(window.navigator.userAgent)
}

function readLiffState() {
  const params = new URLSearchParams(window.location.search)
  const raw = params.get('liff.state')
  if (!raw) return null

  let path = raw
  if (!path.startsWith('/')) {
    try {
      const decoded = decodeURIComponent(path)
      if (decoded.startsWith('/')) path = decoded
    } catch {
      return null
    }
  }

  if (!path.startsWith('/') || path.startsWith('//')) return null

  const next = new URL(path, window.location.origin)
  if (next.origin !== window.location.origin) return null
  return next
}

function restoreLiffState() {
  const next = readLiffState()
  if (!next || next.pathname === window.location.pathname) return

  window.history.replaceState(null, '', `${next.pathname}${next.search}${next.hash}`)
}

function isPublicPath() {
  const pathname = readLiffState()?.pathname ?? window.location.pathname
  return PUBLIC_PATHS.includes(pathname)
}

/** Our own web OAuth callback, which liff.init() must not try to consume. */
function isWebOAuthCallback() {
  const params = new URLSearchParams(window.location.search)
  return params.has('code') && !params.has('liffClientId')
}

/** Init LIFF once. Only inside LINE: in an external browser the web OAuth flow
 * handles login, and LIFF login there would bounce through the LINE app. */
export function ensureLiff() {
  if (!LIFF_ID || !isInLineApp() || isWebOAuthCallback()) return Promise.resolve()

  liffReady ??= liff.init({ liffId: LIFF_ID }).catch((error: unknown) => {
    console.warn('LIFF init failed', error)
  })
  return liffReady
}

export async function initLiff() {
  if (!LIFF_ID) return

  // Public pages stay logged out in LINE; LoginPage inits LIFF on demand.
  if (!isPublicPath()) await ensureLiff()

  restoreLiffState()
}

/** Any browser inside the LINE app, LIFF or not. */
export function isInLineApp() {
  return !isLocalHost() && isLineAppBrowser()
}

/** Access token from the LIFF browser, or null outside LIFF or before LIFF login. */
export function getLiffAccessToken() {
  if (!LIFF_ID || !isInLineApp()) return null

  try {
    if (!liff.isInClient() || !liff.isLoggedIn()) return null
    return liff.getAccessToken()
  } catch {
    return null
  }
}

/** Stop the next automatic LINE login, which would bounce back to the other browser. */
export function suppressLineAutoLogin() {
  sessionStorage.setItem(LINE_AUTO_LOGIN_SUPPRESSED_KEY, '1')
}

export function shouldAutoLineLogin() {
  return isInLineApp() && sessionStorage.getItem(LINE_AUTO_LOGIN_SUPPRESSED_KEY) !== '1'
}
