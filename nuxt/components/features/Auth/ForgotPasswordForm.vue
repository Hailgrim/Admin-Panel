<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import Form from '~/components/shared/ui/Form/Form.vue'
import FormAlert from '~/components/shared/ui/Form/FormAlert.vue'
import FormField from '~/components/shared/ui/Form/FormField.vue'
import FormButton from '~/components/shared/ui/Form/FormButton.vue'
import FormLink from '~/components/shared/ui/Form/FormLink.vue'
import CustomModal from '~/components/shared/ui/CustomModal/CustomModal.vue'
import ResetPasswordForm from '~/components/features/Auth/ResetPasswordForm.vue'
import authApi from '~/api/auth/authApi'

const { t, locale } = useI18n()
const email = ref('')
const emailIsValid = (value: string) =>
  value.length > 0 || t('emailValidationI18N')
const { data, error, execute, pending, args } = authApi.forgotPassword()
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

watch(data, () => {
  if (data.value) resetModal.value = true
})
</script>

<template>
  <Form @submit="submitHandler">
    <FormAlert v-if="errorText" :text="errorText" type="error" />
    <FormField
v-model="email" :hint="$t('emailValidationI18N')" :label="$t('email')" name="email" required
      :rules="[emailIsValid]" type="email" />
    <FormButton block color="success" :loading="pending" type="submit">
      {{ $t('confirm') }}
    </FormButton>
    <FormLink :href="ROUTES.ui.signIn" :text="$t('signInText')" />
    <FormLink :href="ROUTES.ui.signUp" :text="$t('signUpText')" />
    <CustomModal v-model="resetModal" :title="$t('resetPassword')">
      <ResetPasswordForm :email="args?.email || ''" @close="resetModal = false" />
    </CustomModal>
  </Form>
</template>
