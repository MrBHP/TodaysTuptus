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

  routeRules: {
    // Lista zdjęć jest generowana przy budowaniu (npm run build/generate),
    // więc gotowa strona działa na każdym hostingu, także statycznym.
    '/api/photos': { prerender: true },
  },

  modules: ['@nuxt/ui'],
})