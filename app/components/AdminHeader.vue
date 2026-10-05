<script setup lang="ts">
defineProps<{ title: string }>()
const { signOut } = useAuth()
</script>

<template>
  <header class="flex flex-wrap items-center justify-between gap-4">
    <h1 class="text-3xl font-bold text-amber-900">{{ title }}</h1>
    <nav class="flex flex-wrap gap-2">
      <UButton to="/admin" variant="ghost" active-variant="soft">Zdjęcia</UButton>
      <UButton to="/admin/tickets" variant="ghost" active-variant="soft">Zgłoszenia</UButton>
      <UButton to="/" variant="ghost">Strona</UButton>
      <UButton variant="outline" @click="signOut({ callbackUrl: '/' })">Wyloguj</UButton>
    </nav>
  </header>
</template>
