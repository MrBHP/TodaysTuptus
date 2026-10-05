// DELETE /api/walks/:id → usuwa zgłoszenie. Tylko dla zalogowanych.
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const deleted = await useDb()('walk_form').where({ id: Number(getRouterParam(event, 'id')) }).delete()
  if (!deleted) throw createError({ statusCode: 404, message: 'Nie ma takiego zgłoszenia' })
  return { ok: true }
})
