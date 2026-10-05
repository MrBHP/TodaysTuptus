<script setup lang="ts">
// Strona tylko dla niezalogowanych; zalogowanego przekieruje na /admin
definePageMeta({
  middleware: 'sidebase-auth',
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/admin' },
})

const { signIn } = useAuth()
const secret = ref('')
const error = ref('')
const loading = ref(false)

async function login() {
  loading.value = true
  error.value = ''
  // 'credentials' = CredentialsProvider z server/api/auth/[...].ts
  const res = await signIn('credentials', { secret: secret.value, redirect: false })
  loading.value = false

  if (res?.error) {
    error.value = 'Zły sekret 🐾'
    return
  }
  // Wracamy tam, skąd middleware przekierował na logowanie (tylko w obrębie strony)
  const callback = String(useRoute().query.callbackUrl ?? '')
  const path = callback ? new URL(callback, window.location.origin).pathname : ''
  await navigateTo(path.startsWith('/admin') ? path : '/admin')
}
</script>

<template>
  <main class="min-h-screen bg-amber-50 flex items-center justify-center p-4">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h1 class="text-xl font-bold text-amber-900">Panel Tuptusia 🔒</h1>
      </template>

      <form class="flex flex-col gap-4" @submit.prevent="login">
        <UInput
          v-model="secret"
          type="password"
          placeholder="Sekret"
          autofocus
          class="w-full"
        />
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <UButton type="submit" block :loading="loading" :disabled="!secret">
          Zaloguj
        </UButton>
      </form>
    </UCard>
  </main>
</template>
