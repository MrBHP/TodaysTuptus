import knex, { type Knex } from 'knex'

// Jedno połączenie (pula) na cały serwer, tworzone przy pierwszym użyciu.
// Pliki w server/utils są auto-importowane, więc w każdym endpoincie
// możesz po prostu napisać: const photos = await useDb()('photos').select()
let db: Knex | undefined

export function useDb(): Knex {
  if (!db) {
    const config = useRuntimeConfig()
    db = knex({
      client: 'pg',
      connection: {
        host: config.dbHost,
        port: Number(config.dbPort),
        database: config.dbName,
        user: config.dbUser,
        password: config.dbPassword,
      },
      pool: { min: 0, max: 5 },
    })
  }
  return db
}
