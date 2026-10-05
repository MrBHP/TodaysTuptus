import { timingSafeEqual } from 'node:crypto'
import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'

const config = useRuntimeConfig()

// Porównanie odporne na mierzenie czasu odpowiedzi
function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

export default NuxtAuthHandler({
  secret: config.authSecret,
  pages: { signIn: '/login' },
  providers: [
    // @ts-expect-error: przy SSR import trzeba wywołać przez .default
    CredentialsProvider.default({
      name: 'Sekret',
      credentials: { secret: { label: 'Sekret', type: 'password' } },
      authorize(credentials: { secret?: string } | undefined) {
        if (!config.adminSecret) {
          throw new Error('Brak NUXT_ADMIN_SECRET w .env')
        }
        if (credentials?.secret && safeEqual(credentials.secret, config.adminSecret)) {
          return { id: 'admin', name: 'Admin' }
        }
        return null
      },
    }),
  ],
})
