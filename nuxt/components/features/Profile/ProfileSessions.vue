<script setup lang="ts">
import SessionForm from '~/components/features/Profile/SessionForm.vue'
import { useMainStore } from '~/store/main/main'
import profileApi from '~/api/profile/profileApi'
import type { IExternalSession } from '~/api/profile/types'

const { locale } = useI18n()
const { data, error, execute, pending } = profileApi.getSessions()
const mainStore = useMainStore()
const sessions = ref<IExternalSession[] | null>(null)

watch(
  data,
  () => {
    sessions.value = data.value &&
    data.value.sort((a, b) => (!a.current && b.current ? 1 : -1))
  },
)

watch(
  error,
  () => {
    if (error.value)
      mainStore.addAlert({ type: 'error', text: makeErrorText(error.value, locale.value) })
  },
)

onMounted(() => {
  execute()
})
</script>

<template>
  <v-skeleton-loader v-if="pending" height="68" />
  <SessionForm
v-for="session of sessions" :key="session.id" :session="session"
    @delete="sessions = sessions?.filter((item) => item.id !== session.id) || null" />
</template>
