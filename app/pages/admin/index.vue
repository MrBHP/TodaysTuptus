<script setup lang="ts">
// Bez zalogowania przekierowanie na /login
definePageMeta({ middleware: 'sidebase-auth' })

const toast = useToast()

const { data: photos, refresh } = await useFetch<Photo[]>('/api/photos', {
  default: () => [],
})

const page = ref(1)
const itemsPerPage = 12
const totalPages = computed(() => Math.max(1, Math.ceil(photos.value.length / itemsPerPage)))
const paginatedPhotos = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return photos.value.slice(start, start + itemsPerPage)
})

watch(totalPages, (value) => {
  if (page.value > value) page.value = value
})

const files = ref<File[]>([])
const uploading = ref(false)

async function upload() {
  if (!files.value.length) return
  uploading.value = true

  const form = new FormData()
  for (const file of files.value) form.append('photos', file)

  try {
    const added = await $fetch<Photo[]>('/api/photos', { method: 'POST', body: form })
    toast.add({ title: `Dodano zdjęć: ${added.length}`, color: 'success' })
    files.value = []
    await refresh()
  } catch (e: any) {
    toast.add({ title: e?.data?.message ?? 'Nie udało się wrzucić zdjęć', color: 'error' })
  } finally {
    uploading.value = false
  }
}

async function remove(photo: Photo) {
  if (!window.confirm('Usunąć to zdjęcie?')) return
  await $fetch(`/api/photos/${photo.id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <main class="min-h-screen bg-amber-50 p-4">
    <div class="mx-auto max-w-4xl flex flex-col gap-6">
      <AdminHeader title="Panel Tuptusia 🐶" />

      <UCard>
        <form class="flex flex-col gap-4" @submit.prevent="upload">
          <UFileUpload
            v-model="files"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif"
            label="Upuść tu zdjęcia Tuptusia"
            description="JPG, PNG, WEBP, GIF lub HEIC (iPhone), do 15 MB"
            layout="grid"
            class="w-full min-h-48"
          />
          <UButton type="submit" :loading="uploading" :disabled="!files.length" class="self-end">
            Wrzuć {{ files.length || '' }}
          </UButton>
        </form>
      </UCard>

      <section>
        <h2 class="mb-3 text-lg font-semibold text-amber-900">
          Zdjęcia ({{ photos.length }})
        </h2>
        <p v-if="!photos.length" class="text-amber-800">Jeszcze nic tu nie ma.</p>
        <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          <li v-for="photo in paginatedPhotos" :key="photo.id" class="group relative">
            <img :src="photo.url" alt="" class="aspect-square w-full rounded-xl object-cover shadow">
            <UButton
              color="error"
              size="xs"
              class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 focus:opacity-100"
              @click="remove(photo)"
            >
              Usuń
            </UButton>
          </li>
        </ul>
        <UPagination
          v-if="totalPages > 1"
          v-model:page="page"
          :items-per-page="itemsPerPage"
          :total="photos.length"
          class="mt-4 justify-center"
        />
      </section>
    </div>
  </main>
</template>
