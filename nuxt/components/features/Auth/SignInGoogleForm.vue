<script setup lang="ts">
import Form from '~/components/shared/ui/Form/Form.vue'
import type { IWindowMessage } from './types'
import type { IUser } from '~/api/users/types'
import authApi from '~/api/auth/authApi'
import FormAlert from '~/components/shared/ui/Form/FormAlert.vue'

const { t, locale } = useI18n()
const errorText = ref<string | null>(null)
const hash = new URLSearchParams(location?.hash.slice(1) || '')
const { data, error, execute } = authApi.signInGoogle()

watch(
  error,
  () => {
    if (error.value)
      switch (error.value?.status) {
        case 410:
          errorText.value = t('userDeleted')
          break
        default:
          errorText.value = makeErrorText(error.value, locale.value)
      }
  },
)
structuredClone
onMounted(() => {
  if (hash.has('access_token')) {
    execute({ googleAccessToken: hash.get('access_token')! })
  } else {
    errorText.value = t('error')
  }

  const messageHandler = (event: MessageEvent<string>) => {
    if (!data.value) return
    if (event.data === hash.get('state')) {
      const result: IWindowMessage<IUser> = {
        type: ROUTES.ui.signInGoogle,
        payload: toRaw(data.value),
      }
      event.source?.postMessage(result)
      window.removeEventListener('message', messageHandler)
    }
    window.close()
  }

  window.addEventListener('message', messageHandler)
})
</script>

<template>
  <Form>
    <FormAlert v-if="errorText" :text="errorText" type="error" />
    <v-card-text v-else class="text-center py-3">
      {{ $t('loading') }}...
    </v-card-text>
  </Form>
</template>