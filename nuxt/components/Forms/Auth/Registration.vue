<script setup lang="ts">
import FormBox from '../FormBox.vue'
import FormAlert from '../FormAlert.vue'
import FormTextField from '../FormTextField.vue'
import FormPasswordField from '../FormPasswordField.vue'
import FormButton from '../FormButton.vue'
import FormAuthLink from '../FormAuthLink.vue'
import CustomModal from '~/components/Other/CustomModal.vue'
import RegistrationSuccess from '~/components/Forms/Auth/RegistrationSuccess.vue'
import { useAuthStore } from '~/stores/auth'

const { t, locale } = useI18n()
const name = ref('')
const nameIsValid = (value: string) => testString(NAME_REGEX, value) || t('nameValidation')
const email = ref('')
const emailIsValid = (value: string) => testString(EMAIL_REGEX, value) || t('emailValidation')
const password = ref('')
const passwordIsValid = (value: string) => testString(PASSWORD_REGEX, value) || t('passwordValidation')
const authStore = useAuthStore()
const errorMsg = ref<string | null>(null)
const successModal = ref(false)
const router = useRouter()

function submitHandler() {
  if (
    nameIsValid(name.value) === true
    && emailIsValid(email.value) === true
    && passwordIsValid(password.value) === true
  )
    authStore.signUp({ name: name.value, email: email.value, password: password.value })
}

function successHandler() {
  successModal.value = false
  router.push(ROUTES.auth.signIn)
}

watch(
  () => authStore.signUpError,
  () => {
    switch (authStore.signUpError?.status) {
      case 409:
        errorMsg.value = t('userAlreadyExist')
        break
      case undefined:
        errorMsg.value = null
        break
      default:
        errorMsg.value = makeErrorText(authStore.signUpError?.message, locale.value)
    }
  },
)

watch(
  () => authStore.signUpData,
  () => {
    if (authStore.signUpData)
      successModal.value = true
  },
)
</script>

<template>
  <FormBox @submit="submitHandler">
    <FormAlert v-if="errorMsg" :title="$t('error')" :text="errorMsg" type="error" />
    <FormTextField
      v-model:model-value="name" required name="name" type="text" :label="$t('name')"
      :rules="[nameIsValid]" :hint="$t('nameValidation')"
    />
    <FormTextField
      v-model:model-value="email" required name="email" type="text" :label="$t('email')"
      :rules="[emailIsValid]" :hint="$t('emailValidation')"
    />
    <FormPasswordField
      v-model:model-value="password" required name="password"
      :label="$t('password')" :rules="[passwordIsValid]" :hint="$t('passwordValidation')"
    />
    <FormButton block type="submit" color="success" :loading="authStore.signUpPending">
      {{ $t('signUp') }}
    </FormButton>
    <FormAuthLink :href="ROUTES.auth.signIn" :text="$t('signInText')" />
    <FormAuthLink :href="ROUTES.auth.forget" :text="$t('forgotPasswordText')" />
    <CustomModal v-model="successModal" :title="$t('registration')">
      <RegistrationSuccess :email="email" @close="successHandler" />
    </CustomModal>
  </FormBox>
</template>
