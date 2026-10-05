// GET /api/photos → [{ id, filename, url }, ...]
// GET /api/photos?page=1&pageSize=12 → { items, total, page, pageSize }
export default defineEventHandler(async (event): Promise<Photo[] | PaginatedPhotos> => {
  const query = getQuery(event)
  const hasPagination = query.page !== undefined || query.pageSize !== undefined

  if (!hasPagination) {
    const rows = await useDb()('photos').select('id', 'filename').orderBy('id', 'desc')
    return rows.map((r) => ({ ...r, url: photoUrl(r.filename) }))
  }

  const requestedPage = Number(query.page)
  const requestedPageSize = Number(query.pageSize)
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const pageSize = Number.isInteger(requestedPageSize) && requestedPageSize > 0
    ? Math.min(requestedPageSize, 100)
    : 12
  const db = useDb()
  const [{ count }] = await db('photos').count<{ count: string }>({ count: '*' })
  const total = Number(count)
  const lastPage = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, lastPage)
  const rows = await db('photos')
    .select('id', 'filename')
    .orderBy('id', 'desc')
    .limit(pageSize)
    .offset((currentPage - 1) * pageSize)

  return {
    items: rows.map((r) => ({ ...r, url: photoUrl(r.filename) })),
    total,
    page: currentPage,
    pageSize,
  }
})
