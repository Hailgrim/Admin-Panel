<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

const { email } = defineProps<{
  email: string
}>()
const emit = defineEmits<{
  close: []
}>()

const { t, locale } = useI18n()
const mainStore = useMainStore()
const code = ref('')
const codeIsValid = (value: string) =>
  value.length > 0 || `${t('codeFromEmail')} (${email})`
const { status, error, execute } = profileApi.changeEmailConfirm({ code })
const rights = useRights(ROUTES.api.profile)

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (!results.valid) {
    return
  }

  execute()
}

watch(error, () => {
  if (!error.value) {
    return
  }

  switch (error.value.statusCode) {
    case 404:
      mainStore.addAlert({ type: 'error', text: t('wrongEmailOrCode') })
      break
    default:
      mainStore.addAlert({
        type: 'error',
        text: getErrorText(error.value, locale.value),
      })
  }
})

watch(status, () => {
  if (status.value === 'success') {
    emit('close')

    if (mainStore.profile) {
      mainStore.setProfile({ ...mainStore.profile, email })
    }
  }
})
</script>

<template>
  <FormBase @submit="submitHandler">
    <FormField
      v-model="code"
      :hint="`${$t('codeFromEmail')} (${email})`"
      :label="$t('code')"
      name="code"
      required
      :rules="[codeIsValid]"
    />
    <FormButton
      block
      color="success"
      :disabled="!rights.updating"
      :loading="status === 'pending' || status === 'success'"
      type="submit"
    >
      {{ $t('confirm') }}
    </FormButton>
    <FormButton
      block
      color="error"
      type="button"
      @click="$emit('close')"
    >
      {{ $t('close') }}
    </FormButton>
  </FormBase>
</template>
