<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import Form from '~/components/shared/ui/Form/Form.vue'
import FormAlert from '~/components/shared/ui/Form/FormAlert.vue'
import FormField from '~/components/shared/ui/Form/FormField.vue'
import FormPassword from '~/components/shared/ui/Form/FormPassword.vue'
import FormButton from '~/components/shared/ui/Form/FormButton.vue'
import FormLink from '~/components/shared/ui/Form/FormLink.vue'
import CustomModal from '~/components/shared/ui/CustomModal/CustomModal.vue'
import SignUpSuccessForm from '~/components/features/Auth/SignUpSuccessForm.vue'
import authApi from '~/api/auth/authApi'

const { t, locale } = useI18n()
const name = ref('')
const nameIsValid = (value: string) => testString(NAME_REGEX, value) || t('nameValidation')
const email = ref('')
const emailIsValid = (value: string) => testString(EMAIL_REGEX, value) || t('emailValidation')
const password = ref('')
const passwordIsValid = (value: string) => testString(PASSWORD_REGEX, value) || t('passwordValidation')
const { data, error, execute, pending } = authApi.signUp()
const errorMsg = ref<string | null>(null)
const successModal = ref(false)
const router = useRouter()

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (results.valid)
    execute({ name: name.value, email: email.value, password: password.value })
}

function successHandler() {
  successModal.value = false
  router.push(ROUTES.ui.signIn)
}

watch(
  error,
  () => {
    if (error.value)
      switch (error.value?.status) {
        case 409:
          errorMsg.value = t('userAlreadyExist')
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
      successModal.value = true
  },
)
</script>

<template>
  <Form @submit="submitHandler">
    <FormAlert v-if="errorMsg" :text="errorMsg" type="error" />
    <FormField
v-model="name" :hint="$t('nameValidation')" :label="$t('name')" name="name" required
      :rules="[nameIsValid]" />
    <FormField
v-model="email" :hint="$t('emailValidation')" :label="$t('email')" name="email" required
      :rules="[emailIsValid]" type="email" />
    <FormPassword
v-model="password" :hint="$t('passwordValidation')" :label="$t('password')" name="password" required
      :rules="[passwordIsValid]" />
    <FormButton block color="success" :loading="pending" type="submit">
      {{ $t('signUp') }}
    </FormButton>
    <FormLink :href="ROUTES.ui.signIn" :text="$t('signInText')" />
    <FormLink :href="ROUTES.ui.forget" :text="$t('forgotPasswordText')" />
    <CustomModal v-model="successModal" :title="$t('registration')">
      <SignUpSuccessForm :email="email" @close="successHandler" />
    </CustomModal>
  </Form>
</template>
