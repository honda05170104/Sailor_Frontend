import { requestJson } from './api'
import { isLineAppBrowser } from './liff'

const CHANNEL_ID = import.meta.env.VITE_LINE_CHANNEL_ID?.trim() || ''
const STATE_KEY = 'line_oauth_state'
const VERIFIER_KEY = 'line_oauth_verifier'
const ATTEMPT_KEY = 'line_oauth_attempt'
const ATTEMPT_TTL_MS = 10 * 60 * 1000
const PENDING_KEY = 'line_oauth_pending'
const CONSUMED_KEY = 'line_oauth_consumed'

type LineLoginAttempt = {
  state: string
  verifier: string
  createdAt: number
}

// localStorage, because LINE app-to-app login returns to the browser in a new tab.
function saveAttempt(attempt: LineLoginAttempt) {
  localStorage.setItem(ATTEMPT_KEY, JSON.stringify(attempt))
}

function readAttempt(): LineLoginAttempt | null {
  const raw = localStorage.getItem(ATTEMPT_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as LineLoginAttempt
    if (!parsed?.state || !parsed?.verifier) throw new Error('invalid')
    if (Date.now() - parsed.createdAt > ATTEMPT_TTL_MS) throw new Error('expired')
    return parsed
  } catch {
    localStorage.removeItem(ATTEMPT_KEY)
    return null
  }
}

function clearAttempt() {
  localStorage.removeItem(ATTEMPT_KEY)
  sessionStorage.removeItem(STATE_KEY)
  sessionStorage.removeItem(VERIFIER_KEY)
}

export function hasLineChannelId() {
  return Boolean(CHANNEL_ID)
}

export function getLineRedirectUri() {
  return `${window.location.origin}/login`
}

function toBase64Url(bytes: Uint8Array) {
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function createPkce() {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  const verifier = toBase64Url(bytes)
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  return {
    verifier,
    challenge: toBase64Url(new Uint8Array(digest)),
  }
}

export async function startLineLogin() {
  if (!CHANNEL_ID) throw new Error('尚未設定 VITE_LINE_CHANNEL_ID')

  sessionStorage.removeItem(PENDING_KEY)
  sessionStorage.removeItem(CONSUMED_KEY)

  const state = crypto.randomUUID()
  const { verifier, challenge } = await createPkce()
  saveAttempt({ state, verifier, createdAt: Date.now() })

  const url = new URL('https://access.line.me/oauth2/v2.1/authorize')
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', CHANNEL_ID)
  url.searchParams.set('redirect_uri', getLineRedirectUri())
  url.searchParams.set('state', state)
  url.searchParams.set('scope', 'profile openid')
  url.searchParams.set('code_challenge', challenge)
  url.searchParams.set('code_challenge_method', 'S256')
  // Outside LINE, auto login hands off to the LINE app through the
  // access.line.me universal link and can bounce until login fails. Inside
  // LINE this must stay off: it also disables auto login there.
  if (!isLineAppBrowser()) url.searchParams.set('disable_auto_login', 'true')

  window.location.assign(url.toString())
}

/** OAuth code that belongs to another browser, so this session has no PKCE verifier. */
export function isUnownedLineCallback(params: URLSearchParams) {
  const code = params.get('code')
  if (!code) return false

  const pending = readPending()
  if (pending?.code === code) return false

  return readAttempt()?.state !== params.get('state')
}

export type LineLoginPayload = {
  code: string
  redirectUri: string
  codeVerifier: string
}

function readPending(): LineLoginPayload | null {
  const raw = sessionStorage.getItem(PENDING_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as LineLoginPayload
    if (!parsed?.code || !parsed?.redirectUri || !parsed?.codeVerifier) return null
    return parsed
  } catch {
    sessionStorage.removeItem(PENDING_KEY)
    return null
  }
}

export function takeLineLoginCallback(params: URLSearchParams): LineLoginPayload | null {
  const code = params.get('code')
  const state = params.get('state')
  const error = params.get('error')
  const errorDescription = params.get('error_description')

  if (error) {
    clearLineLoginCallback()
    throw new Error(errorDescription || 'LINE 登入已取消')
  }

  if (code) {
    const pending = readPending()
    const alreadySaved = pending?.code === code

    if (!alreadySaved) {
      const attempt = readAttempt()
      if (!attempt || attempt.state !== state) {
        clearLineLoginCallback()
        throw new Error('LINE 登入驗證失敗，請再試一次')
      }

      const codeVerifier = attempt.verifier
      clearAttempt()
      sessionStorage.setItem(
        PENDING_KEY,
        JSON.stringify({
          code,
          redirectUri: getLineRedirectUri(),
          codeVerifier,
        }),
      )
    }
  }

  const pending = readPending()
  if (!pending) return null

  if (sessionStorage.getItem(CONSUMED_KEY) === pending.code) return null
  sessionStorage.setItem(CONSUMED_KEY, pending.code)
  return pending
}

export async function exchangeLineAccessToken(payload: LineLoginPayload) {
  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(
    /\/$/,
    '',
  )
  const data = await requestJson<{ accessToken?: string }>(
    `${API_BASE_URL}/api/v1/user/lineToken`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      errorMessage: '無法取得 LINE access token',
    },
  )

  const accessToken = data?.accessToken
  if (!accessToken) {
    throw new Error('無法取得 LINE access token')
  }

  return accessToken
}

export function clearLineLoginCallback() {
  sessionStorage.removeItem(PENDING_KEY)
  sessionStorage.removeItem(CONSUMED_KEY)
  clearAttempt()
}
