# Dzisiejszy Tuptuś 🐶

Nuxt 4 + Vue 3 + Tailwind CSS 4.

## Start

```bash
npm install
npm run dev
```

Strona: http://localhost:3000

## Struktura

```
app/
  app.vue                 ← główny komponent (frontend)
  assets/css/main.css     ← import Tailwinda
server/
  api/photos.get.ts       ← backend: GET /api/photos zwraca listę zdjęć
public/
  zdjecia/                ← tu wrzucasz zdjęcia Tuptusia
server/utils/db.ts        ← połączenie z bazą: useDb()
migrations/               ← migracje Knexa (struktura tabel)
knexfile.js               ← konfiguracja CLI Knexa
nuxt.config.ts            ← konfiguracja Nuxta (Tailwind, runtimeConfig bazy)
```

## Baza danych (PostgreSQL + Knex)

Jednorazowo na Macu:

```bash
brew install postgresql@17
brew services start postgresql@17
createuser todays_tuptus
createdb todays_tuptus -O todays_tuptus
cp .env.example .env   # uzupełnij hasło, jeśli je ustawiłeś
npm run db:migrate
```

Komendy:
- `npm run db:migrate`: uruchamia nowe migracje
- `npm run db:rollback`: cofa ostatnią paczkę migracji
- `npm run db:make nazwa_migracji`: tworzy nowy plik w `migrations/`

W endpointach (`server/api/*.ts`) baza jest dostępna przez auto-importowane `useDb()`:

```ts
const photos = await useDb()('photos').select('id', 'filename')
```

## Wdrożenie

- `npm run generate` → statyczna strona w `.output/public` (Netlify, Vercel, GitHub Pages, zwykły hosting).
- `npm run build` → aplikacja Node w `.output` (`node .output/server/index.mjs`).

Lista zdjęć jest generowana podczas budowania, więc po dodaniu nowych zdjęć zbuduj stronę ponownie.
