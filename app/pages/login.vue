<script setup lang="ts">
// Strona tylko dla niezalogowanych; zalogowanego przekieruje na /admin
definePageMeta({
  middleware: 'sidebase-auth',
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/admin' },
})

const { signIn } = useAuth()
const route = useRoute()
const loading = ref(false)

const error = computed(() => {
  const code = route.query.error
  if (!code) return ''
  if (code === 'AccessDenied') return 'To konto nie ma dostępu do panelu 🐾'
  return 'Nie udało się zalogować, spróbuj jeszcze raz 🐾'
})

function targetPath() {
  const callback = String(route.query.callbackUrl ?? '')
  const path = callback ? new URL(callback, window.location.origin).pathname : ''
  return path.startsWith('/admin') ? path : '/admin'
}

async function login() {
  loading.value = true
  await signIn('google', { callbackUrl: targetPath() })
}
</script>

<template>
  <main class="min-h-screen bg-amber-50 flex items-center justify-center p-4">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h1 class="text-xl font-bold text-amber-900">Panel Tuptusia 🔒</h1>
      </template>

      <div class="flex flex-col gap-4">
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <UButton block :loading="loading" @click="login">
          Zaloguj przez Google
        </UButton>
      </div>
    </UCard>
  </main>
</template>
