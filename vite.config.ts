import { Buffer } from 'node:buffer'
import type { IncomingMessage, ServerResponse } from 'node:http'

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

function readJsonBody(req: IncomingMessage) {
  return new Promise<Record<string, string>>((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        resolve(raw ? (JSON.parse(raw) as Record<string, string>) : {})
      } catch {
        reject(new Error('Invalid JSON'))
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function lineTokenPlugin(channelId: string, channelSecret: string): Plugin {
  const handle = async (
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void,
  ) => {
    const url = req.url?.split('?')[0]
    if (url !== '/__line/token' || req.method !== 'POST') {
      next()
      return
    }

    if (!channelId || !channelSecret) {
      sendJson(res, 500, { message: '尚未設定 LINE_CHANNEL_SECRET' })
      return
    }

    try {
      const payload = await readJsonBody(req)
      const { code, redirectUri, codeVerifier } = payload
      if (!code || !redirectUri || !codeVerifier) {
        sendJson(res, 400, { message: '缺少 LINE 授權參數' })
        return
      }

      const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: channelId,
          client_secret: channelSecret,
          code_verifier: codeVerifier,
        }),
      })
      const tokenBody = (await tokenRes.json().catch(() => null)) as {
        access_token?: string
        error_description?: string
        error?: string
      } | null

      if (!tokenRes.ok || !tokenBody?.access_token) {
        sendJson(res, 401, {
          message: tokenBody?.error_description || tokenBody?.error || '無法取得 LINE access token',
        })
        return
      }

      sendJson(res, 200, { accessToken: tokenBody.access_token })
    } catch {
      sendJson(res, 500, { message: '無法取得 LINE access token' })
    }
  }

  return {
    name: 'line-token-exchange',
    configureServer(server) {
      server.middlewares.use(handle)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      lineTokenPlugin(env.VITE_LINE_CHANNEL_ID?.trim() || '', env.LINE_CHANNEL_SECRET?.trim() || ''),
    ],
    preview: {
      allowedHosts: true,
    },
  }
})
