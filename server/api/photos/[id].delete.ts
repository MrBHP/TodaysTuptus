import { unlink } from 'node:fs/promises'
import { join } from 'node:path'

// DELETE /api/photos/:id → usuwa zdjęcie z bazy i z dysku. Tylko dla zalogowanych.
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  const [row] = await useDb()('photos').where({ id }).delete().returning('filename')
  if (!row) {
    throw createError({ statusCode: 404, message: 'Nie ma takiego zdjęcia' })
  }

  await unlink(join(photosDir(), row.filename)).catch(() => {})
  return { ok: true }
})
