import liff from '@line/liff'

const LIFF_ID = import.meta.env.VITE_LIFF_ID?.trim() || ''

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

  const isLocal =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

  if (isLocal) {
    restoreLiffState()
    return
  }

  try {
    await liff.init({ liffId: LIFF_ID })
  } catch (error) {
    console.warn('LIFF init failed', error)
  }

  restoreLiffState()
}
