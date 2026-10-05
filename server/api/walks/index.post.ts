import { validateWalkForm } from '#shared/utils/walk'

// POST /api/walks → zapisuje zgłoszenie na spacer. Dostępne dla każdego.
export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<WalkFormInput> & { website?: string }>(event)

  // Pułapka na boty: pole "website" jest w formularzu ukryte, człowiek go nie wypełni
  if (body?.website) return { ok: true }

  const errors = validateWalkForm(body ?? {})
  if (Object.keys(errors).length) {
    throw createError({ statusCode: 400, message: 'Popraw formularz', data: errors })
  }

  await useDb()('walk_form').insert({
    name: body.name!.trim(),
    email: body.email!.trim().toLowerCase(),
    arguments: body.arguments!.trim(),
    not_guys: body.not_guys === true,
  })
  return { ok: true }
})
