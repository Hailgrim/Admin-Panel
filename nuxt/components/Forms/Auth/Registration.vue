<script setup lang="ts">
import FormBox from '../FormBox.vue'
import FormAlert from '../FormAlert.vue'
import FormTextInput from '../FormTextInput.vue'
import FormPasswordInput from '../FormPasswordInput.vue'
import FormButton from '../FormButton.vue'
import FormAuthLink from '../FormAuthLink.vue'
import CustomModal from '~/components/Other/CustomModal.vue'
import RegistrationSuccess from '~/components/Forms/Auth/RegistrationSuccess.vue'
import { makeErrorText, testString } from '~/libs/functions'
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from '~/libs/constants'
import { useProfileStore } from '~/stores/profile'

const config = useRuntimeConfig()
const { t } = useI18n()
const name = ref('')
const nameIsValid = (value: string) => testString(NAME_REGEX, value) || t('nameValidation')
const email = ref('')
const emailIsValid = (value: string) => testString(EMAIL_REGEX, value) || t('emailValidation')
const password = ref('')
const passwordIsValid = (value: string) => testString(PASSWORD_REGEX, value) || t('passwordValidation')
const profileStore = useProfileStore()
const errorMsg = ref<string | null>(null)
const successModal = ref(false)
const router = useRouter()

function submitHandler() {
  if (
    nameIsValid(name.value) === true
    && emailIsValid(email.value) === true
    && passwordIsValid(password.value) === true
  )
    profileStore.signUp({ name: name.value, email: email.value, password: password.value })
}

function successHandler() {
  successModal.value = false
  router.push(config.public.ROUTES.auth.signIn)
}

watch(
  () => profileStore.signUpError,
  () => {
    switch (profileStore.signUpError?.status) {
      case 409:
        errorMsg.value = t('userAlreadyExist')
        break
      case undefined:
        errorMsg.value = null
        break
      default:
        errorMsg.value = makeErrorText(profileStore.signUpError?.message)
    }
  },
)

watch(
  () => profileStore.signUpResult,
  () => {
    if (profileStore.signUpResult)
      successModal.value = true
  },
)
</script>

<template>
  <FormBox @submit="submitHandler">
    <FormAlert v-if="errorMsg" :title="$t('error')" :text="errorMsg" type="error" />
    <FormTextInput
      v-model:model-value="name" required name="name" type="text" :label="$t('name')"
      :rules="[nameIsValid]" :hint="$t('nameValidation')"
    />
    <FormTextInput
      v-model:model-value="email" required name="email" type="text" :label="$t('email')"
      :rules="[emailIsValid]" :hint="$t('emailValidation')"
    />
    <FormPasswordInput
      v-model:model-value="password" required name="password"
      :label="$t('password')" :rules="[passwordIsValid]" :hint="$t('passwordValidation')"
    />
    <FormButton block type="submit" color="success" :loading="profileStore.signUpLoading">
      {{ $t('signUp') }}
    </FormButton>
    <FormAuthLink :href="$config.public.ROUTES.auth.signIn" :text="$t('signInText')" />
    <FormAuthLink :href="$config.public.ROUTES.auth.forget" :text="$t('forgotPasswordText')" />
    <CustomModal v-model="successModal" :title="$t('registration')">
      <RegistrationSuccess :email="email" @close="successHandler" />
    </CustomModal>
  </FormBox>
</template>
