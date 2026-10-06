<script setup lang="ts">
const { data: photos, error } = await useFetch<Photo[]>('/api/photos', {
  default: () => [],
})

const STORAGE_KEY = 'tuptus-dnia'

interface DailyDraw {
  date: string
  url: string
}

const current = ref<string | null>(null)
const drawnToday = ref(false)
const now = ref(new Date())

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function readDraw(): DailyDraw | null {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
  } catch {
    return null
  }
}

function restore() {
  const saved = readDraw()
  if (saved?.date === today() && photos.value.some((p) => p.url === saved.url)) {
    current.value = saved.url
    drawnToday.value = true
  } else {
    current.value = null
    drawnToday.value = false
  }
}

function draw() {
  if (drawnToday.value) return
  const list = photos.value
  const photo = list[Math.floor(Math.random() * list.length)]
  if (!photo) return

  current.value = photo.url
  drawnToday.value = true
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today(), url: photo.url } satisfies DailyDraw))
}

const untilTomorrow = computed(() => {
  const midnight = new Date(now.value)
  midnight.setHours(24, 0, 0, 0)
  const minutes = Math.max(1, Math.ceil((midnight.getTime() - now.value.getTime()) / 60000))
  const h = Math.floor(minutes / 60)
  return h ? `${h} h ${minutes % 60} min` : `${minutes} min`
})

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  restore()
  timer = setInterval(() => {
    now.value = new Date()
    if (drawnToday.value && readDraw()?.date !== today()) restore()
  }, 30_000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <main class="min-h-screen bg-amber-50 flex flex-col items-center justify-center gap-6 p-4">
    <h1 class="text-4xl font-bold text-amber-900">Dzisiejszy Tuptuś 🐶</h1>

    <p v-if="error" class="text-red-600">Nie udało się pobrać zdjęć.</p>
    <p v-else-if="photos.length === 0" class="text-amber-800">
      Brak zdjęć. Dodaj je w <NuxtLink to="/admin" class="underline">panelu</NuxtLink>.
    </p>

    <template v-else>
      <img
        v-if="current"
        :src="current"
        alt="Tuptuś"
        class="max-h-[60vh] rounded-2xl shadow-lg"
      >

      <p v-if="drawnToday" class="text-center text-amber-800">
        To Twój Tuptuś na dziś!<br>
        <span class="text-sm text-amber-700">Następny za {{ untilTomorrow }} 🐾</span>
      </p>
      <UButton
        v-else
        size="xl"
        @click="draw"
      >
        Losuj Tuptusia ({{ photos.length }} zdjęć)
      </UButton>
    </template>

    <WalkFormModal />
  </main>
</template>
