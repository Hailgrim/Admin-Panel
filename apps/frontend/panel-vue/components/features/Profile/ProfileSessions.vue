<script setup lang="ts">
const { locale } = useI18n()
const mainStore = useMainStore()
const sessions = ref<TExternalSession[] | null>(null)
const { data, error, execute, status } = profileApi.getSessions()

watch(data, () => {
  sessions.value = data.value && Array.from(data.value).sort((a, b) => (!a.current && b.current ? 1 : -1))
})

watch(error, () => {
  if (!error.value) {
    return
  }

  mainStore.addAlert({
    type: 'error',
    text: getErrorText(error.value, locale.value),
  })
})

onMounted(() => {
  execute()
})
</script>

<template>
  <v-skeleton-loader
    v-if="status === 'pending'"
    height="68"
  />
  <SessionForm
    v-for="session of sessions"
    :key="session.id"
    :session="session"
    @delete="
      sessions = sessions?.filter((item) => item.id !== session.id) || null
    "
  />
</template>
