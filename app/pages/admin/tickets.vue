<script setup lang="ts">
definePageMeta({ middleware: 'sidebase-auth' })

const { data: requests, refresh } = await useFetch<WalkRequest[]>('/api/walks', {
  default: () => [],
})

const search = ref('')
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return requests.value
  return requests.value.filter((r) =>
    [r.name, r.email, r.arguments].some((v) => v?.toLowerCase().includes(q)),
  )
})

const PAGE_SIZE = 10
const page = ref(1)
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
const paginated = computed(() =>
  filtered.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE),
)

watch(search, () => (page.value = 1))
watch(pageCount, (n) => {
  if (page.value > n) page.value = n
})

const formatDate = (d: string) =>
  new Date(d).toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' })

async function remove(r: WalkRequest) {
  if (!window.confirm(`Usunąć zgłoszenie od ${r.name}?`)) return
  await $fetch(`/api/walks/${r.id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <main class="min-h-screen bg-amber-50 p-4">
    <div class="mx-auto max-w-4xl flex flex-col gap-6">
      <AdminHeader title="Zgłoszenia na spacer 🦮" />

      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-amber-800">Zgłoszeń: {{ requests.length }}</p>
        <UInput v-model="search" placeholder="Szukaj…" class="w-full sm:w-64" />
      </div>

      <p v-if="!requests.length" class="text-amber-800">Na razie nikt się nie zgłosił.</p>
      <p v-else-if="!filtered.length" class="text-amber-800">Nic nie pasuje do wyszukiwania.</p>

      <UCard v-for="r in paginated" :key="r.id">
        <div class="flex flex-col gap-3">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p class="text-lg font-semibold">{{ r.name }}</p>
              <a :href="`mailto:${r.email}`" class="text-sm text-primary underline">{{ r.email }}</a>
            </div>
            <div class="flex items-center gap-2">
              <UBadge :color="r.not_guys ? 'success' : 'neutral'" variant="subtle">
                Checkbox: {{ r.not_guys ? 'tak' : 'nie' }}
              </UBadge>
              <span class="text-sm text-muted">{{ formatDate(r.created_at) }}</span>
            </div>
          </div>
          <p class="whitespace-pre-line">{{ r.arguments }}</p>
          <UButton color="error" variant="ghost" size="xs" class="self-end" @click="remove(r)">
            Usuń
          </UButton>
        </div>
      </UCard>

      <UPagination
        v-if="filtered.length > PAGE_SIZE"
        v-model:page="page"
        :total="filtered.length"
        :items-per-page="PAGE_SIZE"
        class="self-center"
      />
    </div>
  </main>
</template>
