import { randomUUID } from 'node:crypto'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import heicConvert from 'heic-convert'

const MAX_SIZE = 15 * 1024 * 1024 // 15 MB

// POST /api/photos (multipart, pole "photos") → dodane zdjęcia. Tylko dla zalogowanych.
export default defineEventHandler(async (event): Promise<Photo[]> => {
  await requireAdmin(event)

  const parts = (await readMultipartFormData(event)) ?? []
  const files = parts.filter((p) => p.name === 'photos' && p.filename)
  if (!files.length) {
    throw createError({ statusCode: 400, message: 'Nie wybrano zdjęć' })
  }

  // Najpierw sprawdzamy wszystkie pliki, żeby nie zapisać połowy paczki
  for (const file of files) {
    const ext = extension(file.filename!)
    if (!PHOTO_TYPES[ext] && !HEIC_EXTENSIONS.includes(ext)) {
      throw createError({ statusCode: 400, message: `Nieobsługiwany format: ${file.filename}` })
    }
    if (file.data.length > MAX_SIZE) {
      throw createError({ statusCode: 400, message: `Za duży plik: ${file.filename}` })
    }
  }

  const prepared = []
  for (const file of files) {
    let ext = extension(file.filename!)
    let data: Uint8Array = file.data

    // HEIC/HEIF z iPhone'a → JPG
    if (HEIC_EXTENSIONS.includes(ext)) {
      try {
        data = Buffer.from(await heicConvert({ buffer: file.data, format: 'JPEG', quality: 0.9 }))
      } catch {
        throw createError({ statusCode: 400, message: `Nie udało się odczytać: ${file.filename}` })
      }
      ext = 'jpg'
    }

    // Własna, losowa nazwa: brak kolizji i brak sztuczek typu "../"
    prepared.push({ filename: `${randomUUID()}.${ext === 'jpeg' ? 'jpg' : ext}`, data })
  }

  const dir = photosDir()
  await mkdir(dir, { recursive: true })

  const added: Photo[] = []
  for (const { filename, data } of prepared) {
    const path = join(dir, filename)
    await writeFile(path, data)
    // gdyby zapis do bazy się nie udał, sprzątamy plik z dysku
    const [row] = await useDb()('photos').insert({ filename }).returning(['id', 'filename'])
      .catch(async (e) => { await unlink(path).catch(() => {}); throw e })
    added.push({ ...row, url: photoUrl(row.filename) })
  }
  return added
})

function extension(filename: string) {
  return filename.split('.').pop()?.toLowerCase() ?? ''
}
