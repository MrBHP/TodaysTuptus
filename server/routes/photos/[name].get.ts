import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { join } from 'node:path'

// GET /photos/:name → plik z folderu photos/ (który nie jest w public/)
export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name') ?? ''
  const ext = name.split('.').pop()?.toLowerCase() ?? ''

  // Tylko zwykłe nazwy plików, żadnych "../"
  if (!/^[\w-]+\.\w+$/.test(name) || !PHOTO_TYPES[ext]) {
    throw createError({ statusCode: 404 })
  }

  const path = join(photosDir(), name)
  const info = await stat(path).catch(() => null)
  if (!info?.isFile()) {
    throw createError({ statusCode: 404 })
  }

  setResponseHeaders(event, {
    'Content-Type': PHOTO_TYPES[ext],
    'Content-Length': info.size,
    // nazwy są losowe i się nie zmieniają, więc można cache'ować na długo
    'Cache-Control': 'public, max-age=31536000, immutable',
  })
  return sendStream(event, createReadStream(path))
})
