const CHANNEL_ID = import.meta.env.VITE_LINE_CHANNEL_ID?.trim() || ''
const STATE_KEY = 'line_oauth_state'
const VERIFIER_KEY = 'line_oauth_verifier'
const PENDING_KEY = 'line_oauth_pending'
const CONSUMED_KEY = 'line_oauth_consumed'

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
  sessionStorage.setItem(STATE_KEY, state)
  sessionStorage.setItem(VERIFIER_KEY, verifier)

  const url = new URL('https://access.line.me/oauth2/v2.1/authorize')
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', CHANNEL_ID)
  url.searchParams.set('redirect_uri', getLineRedirectUri())
  url.searchParams.set('state', state)
  url.searchParams.set('scope', 'profile openid')
  url.searchParams.set('code_challenge', challenge)
  url.searchParams.set('code_challenge_method', 'S256')

  window.location.assign(url.toString())
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
      const savedState = sessionStorage.getItem(STATE_KEY)
      const codeVerifier = sessionStorage.getItem(VERIFIER_KEY)
      if (!savedState || savedState !== state || !codeVerifier) {
        clearLineLoginCallback()
        throw new Error('LINE 登入驗證失敗，請再試一次')
      }

      sessionStorage.removeItem(STATE_KEY)
      sessionStorage.removeItem(VERIFIER_KEY)
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
  const response = await fetch('/__line/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const body = (await response.json().catch(() => null)) as
    | { accessToken?: string; message?: string }
    | null

  if (!response.ok || !body?.accessToken) {
    throw new Error(body?.message || '無法取得 LINE access token')
  }

  return body.accessToken
}

export function clearLineLoginCallback() {
  sessionStorage.removeItem(PENDING_KEY)
  sessionStorage.removeItem(STATE_KEY)
  sessionStorage.removeItem(VERIFIER_KEY)
  sessionStorage.removeItem(CONSUMED_KEY)
}
