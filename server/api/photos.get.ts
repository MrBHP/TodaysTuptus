import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

// GET /api/photos → ["/zdjecia/1.jpg", ...]
export default defineEventHandler(async () => {
  const dir = join(process.cwd(), 'public', 'zdjecia')
  const files = await readdir(dir).catch(() => [] as string[])

  return files
    .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
    .map((f) => `/zdjecia/${encodeURIComponent(f)}`)
})
