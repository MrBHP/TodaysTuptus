// Konfiguracja dla CLI knexa (migracje). Nuxt sam wczytuje .env,
// ale `npx knex ...` działa poza Nuxtem, więc wczytujemy .env ręcznie.
try {
  process.loadEnvFile()
} catch {
  // brak pliku .env: zmienne mogą być ustawione w systemie (np. na produkcji)
}

export default {
  client: 'pg',
  connection: {
    host: process.env.NUXT_DB_HOST,
    port: Number(process.env.NUXT_DB_PORT),
    database: process.env.NUXT_DB_NAME,
    user: process.env.NUXT_DB_USER,
    password: process.env.NUXT_DB_PASSWORD,
  },
  pool: { min: 0, max: 5 },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
    stub: './migration.stub', // szablon dla npm run db:make (składnia ESM)
  },
}
