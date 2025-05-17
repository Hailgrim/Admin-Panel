<script setup lang="ts">
const { t, locale } = useI18n()
const errorText = ref<string | null>(null)
const hash = new URLSearchParams(location?.hash.slice(1) || '')
const { data, error, execute } = authApi.signInGoogle()

const messageHandler = (event: MessageEvent<IWindowMessage<string>>) => {
  if (event.data.type !== ROUTES.ui.signInGoogle || !data.value) return

  if (event.data.payload === hash.get('state')) {
    const message: IWindowMessage<IUser> = {
      type: ROUTES.ui.signInGoogle,
      payload: toRaw(data.value),
    }

    event.source?.postMessage(message)
    window.removeEventListener('message', messageHandler)
  }

  window.close()
}

onMounted(() => {
  if (hash.has('access_token')) {
    execute({ googleAccessToken: hash.get('access_token')! })
  }
  else {
    errorText.value = t('error')
  }

  window.addEventListener('message', messageHandler)
})

watch(error, () => {
  if (error.value)
    switch (error.value?.status) {
      case 410:
        errorText.value = t('userDeleted')
        break
      default:
        errorText.value = getErrorText(error.value, locale.value)
    }
})

onUnmounted(() => {
  window.removeEventListener('message', messageHandler)
})
</script>

<template>
  <FormBase>
    <FormAlert
      v-if="errorText"
      :text="errorText"
      type="error"
    />
    <v-card-text
      v-else
      class="text-center py-3"
    >
      {{ $t('loading') }}...
    </v-card-text>
  </formbase>
</template>
