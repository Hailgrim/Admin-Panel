<script setup lang="ts">
import SessionForm from '~/components/features/Profile/SessionForm.vue'
import { useMainStore } from '~/store/main/main'
import profileApi from '~/api/profile/profileApi'
import type { ISession } from '~/api/profile/types'

const { locale } = useI18n()
const { data, error, execute, pending } = profileApi.getSessions()
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
  <v-skeleton-loader v-if="pending" height="68" />
  <template v-else>
    <SessionForm
v-for="session of sessions" :key="session.id" :session="session"
      @delete="sessions = sessions?.filter((item) => item.id !== session.id) || null" />
  </template>
</template>
