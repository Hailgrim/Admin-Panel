<script setup lang="ts">
import Form from '~/components/kit/Form/Form.vue'
import FormAlert from '~/components/kit/Form/FormAlert.vue'
import FormField from '~/components/kit/Form/FormField.vue'
import FormButton from '~/components/kit/Form/FormButton.vue'
import FormLink from '~/components/kit/Form/FormLink.vue'
import CustomModal from '~/components/kit/CustomModal/CustomModal.vue'
import ResetForm from '~/components/entities/Forms/Auth/ResetForm.vue'
import { useAuthStore } from '~/stores/auth/auth'

const { t, locale } = useI18n()
const email = ref('')
const emailIsValid = (value: string) => value.length > 0 || t('emailValidation')
const authStore = useAuthStore()
const errorMsg = ref<string | null>(null)
const resetModal = ref(false)
const router = useRouter()

function formHandler() {
  if (emailIsValid(email.value) === true)
    authStore.forgotPassword(email.value)
}

watch(
  () => authStore.forgotPasswordError,
  () => {
    switch (authStore.forgotPasswordError?.status) {
      case 404:
        errorMsg.value = t('wrongEmail')
        break
      case undefined:
        errorMsg.value = null
        break
      default:
        errorMsg.value = makeErrorText(authStore.forgotPasswordError?.message, locale.value)
    }
  },
)

watch(
  () => authStore.forgotPasswordData,
  () => {
    if (authStore.forgotPasswordData)
      resetModal.value = true
  },
)

watch(
  () => authStore.resetPasswordData,
  () => {
    if (authStore.resetPasswordData)
      router.push(ROUTES.auth.signIn)
  },
)
</script>

<template>
  <Form @submit="formHandler">
    <FormAlert v-if="errorMsg" :text="errorMsg" type="error" />
    <FormField
v-model:model-value="email" required name="email" type="text" :label="$t('email')"
      :rules="[emailIsValid]" :hint="$t('emailValidation')" />
    <FormButton block type="submit" color="success" :loading="authStore.forgotPasswordPending">
      {{ $t('confirm') }}
    </FormButton>
    <FormLink :href="ROUTES.auth.signIn" :text="$t('signInText')" />
    <FormLink :href="ROUTES.auth.signUp" :text="$t('signUpText')" />
    <CustomModal v-model="resetModal" :title="$t('resetPassword')">
      <ResetForm :email="email" @close="resetModal = false" />
    </CustomModal>
  </Form>
</template>
