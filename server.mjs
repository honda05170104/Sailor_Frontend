import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, 'dist')
const port = Number(process.env.PORT || 3131)
const host = process.env.HOST || '0.0.0.0'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
}

function safeJoin(root, requestPath) {
  const decoded = decodeURIComponent(requestPath.split('?')[0])
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '')
  const resolved = path.join(root, normalized)
  if (!resolved.startsWith(root)) return null
  return resolved
}

async function sendFile(req, res, filePath, requestPath) {
  const data = await readFile(filePath)
  const ext = path.extname(filePath).toLowerCase()
  const type = MIME[ext] || 'application/octet-stream'
  const isHashedAsset = requestPath.startsWith('/assets/')
  const cacheControl = isHashedAsset
    ? 'public, max-age=31536000, immutable'
    : ext === '.html'
      ? 'public, max-age=60'
      : 'public, max-age=3600'

  const headers = {
    'Content-Type': type,
    'Cache-Control': cacheControl,
  }

  const accept = req.headers['accept-encoding'] || ''
  if (
    typeof accept === 'string' &&
    accept.includes('gzip') &&
    (type.startsWith('text/') ||
      type.includes('javascript') ||
      type.includes('json') ||
      type.includes('svg'))
  ) {
    const gzipped = gzipSync(data)
    headers['Content-Encoding'] = 'gzip'
    headers['Vary'] = 'Accept-Encoding'
    headers['Content-Length'] = gzipped.length
    res.writeHead(200, headers)
    res.end(gzipped)
    return
  }

  headers['Content-Length'] = data.length
  res.writeHead(200, headers)
  res.end(data)
}

const server = createServer(async (req, res) => {
  const url = req.url || '/'
  const pathname = url.split('?')[0]

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' })
    res.end('Method Not Allowed')
    return
  }

  try {
    let filePath = safeJoin(distDir, pathname === '/' ? '/index.html' : pathname)
    if (!filePath) {
      res.writeHead(400)
      res.end('Bad Request')
      return
    }

    try {
      const info = await stat(filePath)
      if (info.isDirectory()) {
        filePath = path.join(filePath, 'index.html')
      }
      await sendFile(req, res, filePath, pathname === '/' ? '/index.html' : pathname)
      return
    } catch {
      await sendFile(req, res, path.join(distDir, 'index.html'), '/index.html')
    }
  } catch (error) {
    console.error(error)
    res.writeHead(500)
    res.end('Internal Server Error')
  }
})

server.listen(port, host, () => {
  console.log(`Sailor frontend serving dist on http://${host}:${port}`)
})
