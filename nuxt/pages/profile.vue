<script setup lang="ts">
import authApi from '~/api/auth/authApi'
import type { ISession } from '~/api/auth/types'
import UpdateProfileForm from '~/components/entities/Forms/Auth/UpdateProfileForm.vue'
import SessionForm from '~/components/entities/Forms/Auth/SessionForm.vue'
import { useMainStore } from '~/store/main/main'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'profile',
  title: 'profile',
  description: 'profile',
})

const { locale } = useI18n()
const { data, error, execute, pending } = authApi.getSessions()
const mainStore = useMainStore()
const sessions = ref<ISession[] | null>(null)

watch(
  data,
  () => {
    sessions.value = data.value &&
      Array.from(data.value).sort((a, b) => (!a.current && b.current ? 1 : -1))
  },
)

watch(
  error,
  () => {
    if (error.value)
      mainStore.addAlert({ type: 'error', text: makeErrorText(error.value, locale.value) })
  },
)

execute()
</script>

<template>
  <UpdateProfileForm />
  <v-card-title class="px-0 pt-0 pb-3">
    {{ $t('sessions') }}
  </v-card-title>
  <v-skeleton-loader v-if="pending" height="68" />
  <template v-else>
    <SessionForm
v-for="session of sessions" :key="session.id" :session="session"
      @delete="sessions = sessions?.filter((item) => item.id !== session.id) || null" />
  </template>
</template>
