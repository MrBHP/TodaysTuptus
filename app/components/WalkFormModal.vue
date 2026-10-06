<script setup lang="ts">
import { validateWalkForm, WALK_LIMITS } from '#shared/utils/walk'

// ✏️ Tu wpisz treść checkboxa
const CHECKBOX_LABEL = 'Oświadczam, że nie jestem posiadaczem jednego z podanych imion: Bartłomiej, Bartosz, Jakub, Jan, Mikołaj, Oskar, Witold, Ziemowit'

const open = ref(false)
const sent = ref(false)
const sending = ref(false)
const serverError = ref('')

const emptyForm = (): WalkFormInput & { website: string } => ({
  name: '',
  email: '',
  arguments: '',
  not_guys: false,
  website: '', // ukryte pole-pułapka na boty
})
const form = reactive(emptyForm())
const errors = ref<ReturnType<typeof validateWalkForm>>({})

async function submit() {
  errors.value = validateWalkForm(form)
  if (Object.keys(errors.value).length) return

  sending.value = true
  serverError.value = ''
  try {
    await $fetch('/api/walks', { method: 'POST', body: form })
    sent.value = true
    Object.assign(form, emptyForm())
  } catch (e: any) {
    errors.value = e?.data?.data ?? {}
    serverError.value = e?.data?.message ?? 'Coś poszło nie tak, spróbuj ponownie'
  } finally {
    sending.value = false
  }
}

// Po zamknięciu okna wracamy do pustego formularza
watch(open, (isOpen) => {
  if (!isOpen) {
    sent.value = false
    errors.value = {}
    serverError.value = ''
  }
})
</script>

<template>
  <UModal
    v-model:open="open"
    title="Umów się na spacer z Tuptusiem 🦮"
    description="Tuptuś przeczyta wszystkie zgłoszenia i sam wybierze towarzystwo."
  >
    <UButton size="xl" variant="soft">Umów się na spacer z Tuptusiem</UButton>

    <template #body>
      <div v-if="sent" class="flex flex-col items-center gap-4 py-6 text-center">
        <p class="text-5xl">🐶</p>
        <p class="text-lg font-semibold">Hau! Zgłoszenie wysłane.</p>
        <p class="text-muted">Tuptuś się odezwie na podany e-mail.</p>
        <UButton @click="open = false">Zamknij</UButton>
      </div>

      <form v-else class="flex flex-col gap-4" novalidate @submit.prevent="submit">
        <UFormField label="Imię" required :error="errors.name">
          <UInput v-model="form.name" autocomplete="given-name" :maxlength="WALK_LIMITS.name" class="w-full" />
        </UFormField>

        <UFormField label="E-mail kontaktowy" required :error="errors.email">
          <UInput v-model="form.email" type="email" autocomplete="email" :maxlength="WALK_LIMITS.email" class="w-full" />
        </UFormField>

        <UFormField
          label="Dlaczego to Ciebie ma zabrać Tuptuś na spacer?"
          required
          :error="errors.arguments"
          :hint="`${form.arguments.length}/${WALK_LIMITS.arguments}`"
        >
          <UTextarea v-model="form.arguments" :rows="5" autoresize :maxlength="WALK_LIMITS.arguments" class="w-full" />
        </UFormField>

        <UFormField :error="errors.not_guys">
          <UCheckbox v-model="form.not_guys" :label="CHECKBOX_LABEL" />
        </UFormField>

        <!-- pułapka na boty: niewidoczna dla ludzi -->
        <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true">

        <p v-if="serverError" class="text-sm text-error">{{ serverError }}</p>

        <UButton type="submit" block size="lg" :loading="sending">Wyślij zgłoszenie</UButton>
      </form>
    </template>
  </UModal>
</template>
