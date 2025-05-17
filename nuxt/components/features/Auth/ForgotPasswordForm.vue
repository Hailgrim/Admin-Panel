<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

const { t, locale } = useI18n()
const email = ref('')
const emailIsValid = (value: string) =>
  value.length > 0 || t('emailValidationI18N')
const { status, error, execute } = authApi.forgotPassword()
const errorText = ref<string | null>(null)
const resetModal = ref(false)

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (results.valid) execute({ email: email.value })
}

watch(error, () => {
  if (error.value)
    switch (error.value?.status) {
      case 404:
        errorText.value = t('wrongEmail')
        break
      case undefined:
        errorText.value = null
        break
      default:
        errorText.value = getErrorText(error.value, locale.value)
    }
})

watch(status, () => {
  if (status.value === 'success') resetModal.value = true
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
      v-model="email"
      :hint="$t('emailValidationI18N')"
      :label="$t('email')"
      name="email"
      required
      :rules="[emailIsValid]"
      type="email"
      :disabled="status === 'pending'"
    />
    <FormButton
      block
      color="success"
      :loading="status === 'pending'"
      type="submit"
    >
      {{ $t('confirm') }}
    </FormButton>
    <FormLink
      :href="ROUTES.ui.signIn"
      :text="$t('signInText')"
    />
    <FormLink
      :href="ROUTES.ui.signUp"
      :text="$t('signUpText')"
    />
    <CustomModal
      v-model="resetModal"
      :title="$t('resetPassword')"
    >
      <ResetPasswordForm
        :email="email"
        @close="resetModal = false"
      />
    </CustomModal>
  </FormBase>
</template>
