<script setup lang="ts">
import FormBox from '../FormBox.vue'
import FormAlert from '../FormAlert.vue'
import FormTextField from '../FormTextField.vue'
import FormButton from '../FormButton.vue'
import FormAuthLink from '../FormAuthLink.vue'
import CustomModal from '~/components/Other/CustomModal.vue'
import ResetPassword from '~/components/Forms/Auth/ResetPassword.vue'
import { useAuthStore } from '~/stores/auth'

const { t, locale } = useI18n()
const email = ref('')
const emailIsValid = (value: string) => value.length > 0
const authStore = useAuthStore()
const errorMsg = ref<string | null>(null)
const resetModal = ref(false)
const router = useRouter()

function submitHandler() {
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
  <FormBox @submit="submitHandler">
    <FormAlert v-if="errorMsg" :title="$t('error')" :text="errorMsg" type="error" />
    <FormTextField
      v-model:model-value="email" required name="email" type="text" :label="$t('email')"
      :rules="[emailIsValid]" :hint="$t('emailValidation')"
    />
    <FormButton block type="submit" color="success" :loading="authStore.forgotPasswordPending">
      {{ $t('confirm') }}
    </FormButton>
    <FormAuthLink :href="ROUTES.auth.signUp" :text="$t('signUpText')" />
    <FormAuthLink :href="ROUTES.auth.signIn" :text="$t('signInText')" />
    <CustomModal v-model="resetModal" :title="$t('resetPassword')">
      <ResetPassword :email="email" @close="resetModal = false" />
    </CustomModal>
  </FormBox>
</template>
