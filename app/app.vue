<script setup lang="ts">
// useFetch pobiera dane z naszego endpointu w server/api/photos.get.ts
const { data: photos, error } = await useFetch<string[]>('/api/photos', {
  default: () => [],
})

const current = ref<string | null>(null)

function draw() {
  // TODO: tu dodaj logikę "raz dziennie" z localStorage
  const list = photos.value
  current.value = list[Math.floor(Math.random() * list.length)] ?? null
}
</script>

<template>
  <NuxtRouteAnnouncer />
  <main class="min-h-screen bg-amber-50 flex flex-col items-center justify-center gap-6 p-4">
    <h1 class="text-4xl font-bold text-amber-900">Dzisiejszy Tuptuś 🐶</h1>

    <p v-if="error" class="text-red-600">Nie udało się pobrać zdjęć.</p>
    <p v-else-if="photos.length === 0" class="text-amber-800">
      Brak zdjęć. Wrzuć je do folderu <code>public/zdjecia</code>.
    </p>

    <template v-else>
      <img
        v-if="current"
        :src="current"
        alt="Tuptuś"
        class="max-h-[60vh] rounded-2xl shadow-lg"
      >
      <button
        class="rounded-xl bg-amber-500 px-6 py-3 text-lg font-semibold text-white hover:bg-amber-600"
        @click="draw"
      >
        Losuj Tuptusia ({{ photos.length }} zdjęć)
      </button>
    </template>
  </main>
</template>
