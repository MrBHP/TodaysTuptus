import GoogleProvider from 'next-auth/providers/google'
import { NuxtAuthHandler } from '#auth'

const config = useRuntimeConfig()

// Lista maili, które mają dostęp do panelu (NUXT_ADMIN_EMAILS, po przecinku)
const allowedEmails = config.adminEmails
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean)

export default NuxtAuthHandler({
  secret: config.authSecret,
  // Odmowa dostępu wraca na /login z ?error=AccessDenied
  pages: { signIn: '/login', error: '/login' },
  providers: [
    // @ts-expect-error: przy SSR import trzeba wywołać przez .default
    GoogleProvider.default({
      clientId: config.googleClientId,
      clientSecret: config.googleClientSecret,
    }),
  ],
  callbacks: {
    // Wpuszczamy tylko zweryfikowane maile z listy; każde inne konto Google dostaje odmowę
    signIn({ profile }) {
      const p = profile as { email?: string, email_verified?: boolean } | undefined
      const email = p?.email?.toLowerCase()
      return !!email && p?.email_verified === true && allowedEmails.includes(email)
    },
  },
})
