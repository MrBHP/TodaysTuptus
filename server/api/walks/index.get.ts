// GET /api/walks → wszystkie zgłoszenia, najnowsze pierwsze. Tylko dla zalogowanych.
export default defineEventHandler(async (event): Promise<WalkRequest[]> => {
  await requireAdmin(event)
  return useDb()('walk_form')
    .select('id', 'name', 'email', 'arguments', 'not_guys', 'created_at')
    .orderBy('created_at', 'desc')
})
