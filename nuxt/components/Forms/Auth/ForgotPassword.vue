<script setup lang="ts">
import FormBox from '../FormBox.vue'
import FormAlert from '../FormAlert.vue'
import FormTextInput from '../FormTextInput.vue'
import FormButton from '../FormButton.vue'
import FormAuthLink from '../FormAuthLink.vue'
import CustomModal from '~/components/Other/CustomModal.vue'
import ResetPassword from '~/components/Forms/Auth/ResetPassword.vue'
import { makeErrorText } from '~/libs/functions'
import { ROUTES } from '~/libs/constants'
import { useProfileStore } from '~/stores/profile'

const { t } = useI18n()
const email = ref('')
const emailIsValid = (value: string) => value.length > 0
const profileStore = useProfileStore()
const errorMsg = ref<string | null>(null)
const resetModal = ref(false)
const router = useRouter()

function submitHandler() {
  if (emailIsValid(email.value) === true)
    profileStore.forgotPassword(email.value)
}

watch(
  () => profileStore.forgotPasswordError,
  () => {
    switch (profileStore.forgotPasswordError?.status) {
      case 404:
        errorMsg.value = t('wrongEmail')
        break
      case undefined:
        errorMsg.value = null
        break
      default:
        errorMsg.value = makeErrorText(profileStore.forgotPasswordError?.message)
    }
  },
)

watch(
  () => profileStore.forgotPasswordData,
  () => {
    if (profileStore.forgotPasswordData)
      resetModal.value = true
  },
)

watch(
  () => profileStore.resetPasswordData,
  () => {
    if (profileStore.resetPasswordData)
      router.push(ROUTES.auth.signIn)
  },
)
</script>

<template>
  <FormBox @submit="submitHandler">
    <FormAlert v-if="errorMsg" :title="$t('error')" :text="errorMsg" type="error" />
    <FormTextInput
      v-model:model-value="email" required name="email" type="text" :label="$t('email')"
      :rules="[emailIsValid]" :hint="$t('emailValidation')"
    />
    <FormButton block type="submit" color="success" :loading="profileStore.forgotPasswordPending">
      {{ $t('confirm') }}
    </FormButton>
    <FormAuthLink :href="ROUTES.auth.signUp" :text="$t('signUpText')" />
    <FormAuthLink :href="ROUTES.auth.signIn" :text="$t('signInText')" />
    <CustomModal v-model="resetModal" :title="$t('resetPassword')">
      <ResetPassword :email="email" @close="resetModal = false" />
    </CustomModal>
  </FormBox>
</template>
