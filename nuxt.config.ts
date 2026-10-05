// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  // Wartości nadpisywane zmiennymi NUXT_DB_* z pliku .env
  runtimeConfig: {
    dbHost: '127.0.0.1',
    dbPort: '5432',
    dbName: '',
    dbUser: '',
    dbPassword: '',
    authSecret: '',
    adminSecret: '',
    photosDir: 'photos',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'pl' },
      title: 'Dzisiejszy Tuptuś 🐶',
    },
  },

  modules: ['@nuxt/ui', '@sidebase/nuxt-auth'],

  // NextAuth (przez @sidebase/nuxt-auth). Handler: server/api/auth/[...].ts
  auth: {
    provider: { type: 'authjs' },
    // adres API logowania na produkcji bierze się ze zmiennej AUTH_ORIGIN
  },
})