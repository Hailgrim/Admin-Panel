<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import Form from '~/components/shared/kit/Form/Form.vue'
import FormAlert from '~/components/shared/kit/Form/FormAlert.vue'
import FormField from '~/components/shared/kit/Form/FormField.vue'
import FormButton from '~/components/shared/kit/Form/FormButton.vue'
import FormLink from '~/components/shared/kit/Form/FormLink.vue'
import CustomModal from '~/components/shared/kit/CustomModal/CustomModal.vue'
import ResetPasswordForm from '~/components/entities/Forms/Auth/ResetPasswordForm.vue'
import authApi from '~/api/auth/authApi'

const { t, locale } = useI18n()
const email = ref('')
const emailIsValid = (value: string) => value.length > 0 || t('emailValidation')
const { data, error, execute, pending } = authApi.forgotPassword()
const errorMsg = ref<string | null>(null)
const resetModal = ref(false)

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (results.valid)
    execute(email.value)
}

watch(
  error,
  () => {
    switch (error.value?.status) {
      case 404:
        errorMsg.value = t('wrongEmail')
        break
      case undefined:
        errorMsg.value = null
        break
      default:
        errorMsg.value = makeErrorText(error.value, locale.value)
    }
  },
)

watch(
  data,
  () => {
    if (data.value)
      resetModal.value = true
  },
)
</script>

<template>
  <Form @submit="submitHandler">
    <FormAlert v-if="errorMsg" :text="errorMsg" type="error" />
    <FormField
v-model="email" :hint="$t('emailValidation')" :label="$t('email')" name="email" required
      :rules="[emailIsValid]" type="text" />
    <FormButton block color="success" :loading="pending" type="submit">
      {{ $t('confirm') }}
    </FormButton>
    <FormLink :href="ROUTES.auth.signIn" :text="$t('signInText')" />
    <FormLink :href="ROUTES.auth.signUp" :text="$t('signUpText')" />
    <CustomModal v-model="resetModal" :title="$t('resetPassword')">
      <ResetPasswordForm :email="email" @close="resetModal = false" />
    </CustomModal>
  </Form>
</template>
