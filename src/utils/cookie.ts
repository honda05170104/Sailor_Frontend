export function setCookie(name: string, value: string, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

export function getCookie(name: string) {
  const target = `${encodeURIComponent(name)}=`
  const cookies = document.cookie.split(';')

  for (const cookie of cookies) {
    const trimmed = cookie.trim()
    if (trimmed.startsWith(target)) {
      return decodeURIComponent(trimmed.slice(target.length))
    }
  }

  return null
}

export function removeCookie(name: string) {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}
