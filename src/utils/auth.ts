import { getCookie, removeCookie, setCookie } from './cookie'

export const AUTH_TOKEN_COOKIE = 'token'

export function getAuthToken() {
  return getCookie(AUTH_TOKEN_COOKIE)
}

export function setAuthToken(token: string) {
  setCookie(AUTH_TOKEN_COOKIE, token)
}

export function clearAuthToken() {
  removeCookie(AUTH_TOKEN_COOKIE)
}
