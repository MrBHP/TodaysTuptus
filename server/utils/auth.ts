import type { H3Event } from 'h3'
import { getServerSession } from '#auth'

// Wywołaj na początku endpointu, który ma być tylko dla zalogowanych
export async function requireAdmin(event: H3Event) {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({ statusCode: 401, message: 'Musisz się zalogować' })
  }
  return session
}
