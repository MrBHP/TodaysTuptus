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
  app.vue                     ← szkielet (UApp + NuxtPage)
  pages/index.vue             ← strona główna z losowaniem
  pages/login.vue             ← logowanie sekretem
  pages/admin/index.vue       ← panel: wrzucanie i usuwanie zdjęć (tylko zalogowani)
  pages/admin/tickets.vue  ← panel: zgłoszenia na spacer (tylko zalogowani)
  components/WalkFormModal.vue← przycisk + modal "Umów się na spacer" (treść checkboxa tutaj)
server/
  api/auth/[...].ts           ← NextAuth: sprawdza sekret z NUXT_ADMIN_SECRET
  api/photos/index.get.ts     ← GET    /api/photos      lista zdjęć z bazy
  api/photos/index.post.ts    ← POST   /api/photos      upload (tylko zalogowani)
  api/photos/[id].delete.ts   ← DELETE /api/photos/:id  usuwanie (tylko zalogowani)
  routes/photos/[name].get.ts ← GET    /photos/:plik    serwuje zdjęcie z folderu photos/
  api/walks/index.post.ts     ← POST   /api/walks       nowe zgłoszenie (każdy)
  api/walks/index.get.ts      ← GET    /api/walks       lista zgłoszeń (tylko zalogowani)
  api/walks/[id].delete.ts    ← DELETE /api/walks/:id   usuwanie (tylko zalogowani)
  utils/auth.ts               ← requireAdmin(event): 401 dla niezalogowanych
  utils/db.ts                 ← połączenie z bazą: useDb()
shared/types/                 ← typy Photo, WalkRequest (wspólne dla app/ i server/)
shared/utils/walk.ts          ← walidacja formularza spaceru (front + API)
photos/                       ← wrzucone zdjęcia (poza gitem, tworzy się samo)
migrations/                   ← migracje Knexa (struktura tabel)
knexfile.js                   ← konfiguracja CLI Knexa
nuxt.config.ts                ← konfiguracja Nuxta
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

## Logowanie i panel

Logowanie działa na NextAuth (moduł `@sidebase/nuxt-auth`, provider Credentials).
W `.env` ustaw:

```bash
NUXT_AUTH_SECRET=...   # openssl rand -base64 32
NUXT_ADMIN_SECRET=...  # Twój sekret do logowania
AUTH_ORIGIN=http://localhost:3000/api/auth
```

Potem wejdź na http://localhost:3000/admin, wpisz sekret i wrzucaj zdjęcia.
Pliki lądują w `photos/` (nazwy losowe), a wpisy w tabeli `photos`.
Zdjęcia HEIC/HEIF z iPhone'a są przy wrzucaniu konwertowane na JPG (`heic-convert`), bo poza Safari przeglądarki ich nie wyświetlają.

Chcesz zabezpieczyć kolejny endpoint? Na początku handlera:

```ts
await requireAdmin(event)
```

A stronę: `definePageMeta({ middleware: 'sidebase-auth' })`.

## Wdrożenie

Strona potrzebuje serwera Node (logowanie, upload, baza), więc `npm run generate` już nie wystarczy:

```bash
npm run build
node .output/server/index.mjs   # uruchamiaj z katalogu projektu, żeby trafić w photos/
```

Na produkcji ustaw `AUTH_ORIGIN=https://twoja-domena.pl/api/auth` i pilnuj, żeby folder `photos/` przetrwał wdrożenia (nie jest w gicie).

## Docker

Aplikacja działa w kontenerze, a baza w osobnym kontenerze w zewnętrznej sieci `db`.

1. W `.env` ustaw dane bazy (`NUXT_DB_NAME`, `NUXT_DB_USER`, `NUXT_DB_PASSWORD`), sekrety logowania
   i `AUTH_ORIGIN` z prawdziwą domeną. Jeśli kontener Postgresa nie nazywa się `postgres`,
   dopisz `DOCKER_DB_HOST=nazwa_kontenera`.
2. Uruchom:

```bash
docker compose up -d --build
docker compose logs -f app   # powinno być "[migracje] ..." i "Listening on ..."
```

- Migracje odpalają się same przy starcie kontenera (`server/plugins/migrations.ts`).
  Jeśli baza jeszcze wstaje, aplikacja próbuje ponownie przez ok. 30 s.
- Zdjęcia są na wolumenie `photos` (`/app/photos` w kontenerze), więc przetrwają przebudowanie obrazu.
- Sieć `db` musi istnieć wcześniej (`docker network create db`) i kontener bazy musi być do niej podpięty.
