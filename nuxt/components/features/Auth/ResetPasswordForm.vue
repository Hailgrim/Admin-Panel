<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

const { email } = defineProps<{
  email: string
}>()
const emit = defineEmits<{
  close: []
}>()

const { t, locale } = useI18n()
const code = ref('')
const codeIsValid = (value: string) =>
  value.length > 0 || `${t('codeFromEmail')} (${email})`
const password = ref('')
const passwordIsValid = (value: string) =>
  testString(PASSWORD_REGEX, value) || t('passwordValidation')
const { status, error, execute } = authApi.resetPassword()
const errorText = ref<string | null>(null)
const router = useRouter()

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (results.valid)
    execute({ email: email, password: password.value, code: code.value })
}

watch(error, () => {
  if (error.value)
    switch (error.value?.status) {
      case 404:
        errorText.value = t('wrongEmailOrCode')
        break
      case undefined:
        errorText.value = null
        break
      default:
        errorText.value = getErrorText(error.value, locale.value)
    }
})

watch(status, () => {
  if (status.value === 'success') {
    emit('close')
    router.push(ROUTES.ui.signIn)
  }
})
</script>

<template>
  <FormBase @submit="submitHandler">
    <FormAlert
      v-if="errorText"
      :text="errorText"
      type="error"
    />
    <FormField
      v-model="code"
      :hint="`${$t('codeFromEmail')} (${email})`"
      :label="$t('code')"
      name="code"
      required
      :rules="[codeIsValid]"
    />
    <FormPassword
      v-model="password"
      :hint="$t('passwordValidation')"
      :label="$t('newPassword')"
      name="password"
      required
      :rules="[passwordIsValid]"
    />
    <FormButton
      block
      color="success"
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
