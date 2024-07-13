<script setup lang="ts">
import Form from '~/components/kit/Form/Form.vue'
import FormAlert from '~/components/kit/Form/FormAlert.vue'
import FormField from '~/components/kit/Form/FormField.vue'
import FormPassword from '~/components/kit/Form/FormPassword.vue'
import FormButton from '~/components/kit/Form/FormButton.vue'
import FormLink from '~/components/kit/Form/FormLink.vue'
import CustomModal from '~/components/kit/CustomModal/CustomModal.vue'
import SignUpSuccess from '~/components/entities/Forms/Auth/SignUpSuccess.vue'
import { useAuthStore } from '~/stores/auth/auth'

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

function formHandler() {
  if (
    nameIsValid(name.value) === true
    && emailIsValid(email.value) === true
    && passwordIsValid(password.value) === true
  ) {
    authStore.signUp({ name: name.value, email: email.value, password: password.value })
  }
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
  <Form @submit="formHandler">
    <FormAlert v-if="errorMsg" :text="errorMsg" type="error" />
    <FormField
v-model:model-value="name" required name="name" type="text" :label="$t('name')" :rules="[nameIsValid]"
      :hint="$t('nameValidation')" />
    <FormField
v-model:model-value="email" required name="email" type="text" :label="$t('email')"
      :rules="[emailIsValid]" :hint="$t('emailValidation')" />
    <FormPassword
v-model:model-value="password" required name="password" :label="$t('password')"
      :rules="[passwordIsValid]" :hint="$t('passwordValidation')" />
    <FormButton block type="submit" color="success" :loading="authStore.signUpPending">
      {{ $t('signUp') }}
    </FormButton>
    <FormLink :href="ROUTES.auth.signIn" :text="$t('signInText')" />
    <FormLink :href="ROUTES.auth.forget" :text="$t('forgotPasswordText')" />
    <CustomModal v-model="successModal" :title="$t('registration')">
      <SignUpSuccess :email="email" @close="successHandler" />
    </CustomModal>
  </Form>
</template>
