import { resolve } from 'node:path'

export default defineNitroPlugin(async () => {
  if (import.meta.dev || process.env.RUN_MIGRATIONS === 'false') return

  const directory = resolve(process.cwd(), 'migrations')

  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      const [, done] = await useDb().migrate.latest({ directory })
      console.log(done.length ? `[migracje] uruchomione: ${done.join(', ')}` : '[migracje] baza aktualna')
      return
    } catch (e: any) {
      console.error(`[migracje] próba ${attempt}/10 nieudana: ${e?.message ?? e}`)
      await new Promise((r) => setTimeout(r, 3000))
    }
  }
  console.error('[migracje] poddaję się, sprawdź połączenie z bazą (NUXT_DB_*)')
})
