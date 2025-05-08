<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import Form from '~/components/shared/ui/Form/Form.vue'
import FormAlert from '~/components/shared/ui/Form/FormAlert.vue'
import FormField from '~/components/shared/ui/Form/FormField.vue'
import FormPassword from '~/components/shared/ui/Form/FormPassword.vue'
import FormCheckbox from '~/components/shared/ui/Form/FormCheckbox.vue'
import FormButton from '~/components/shared/ui/Form/FormButton.vue'
import FormLink from '~/components/shared/ui/Form/FormLink.vue'
import CustomModal from '~/components/shared/ui/CustomModal/CustomModal.vue'
import VerifyUserForm from '~/components/features/Auth/VerifyUserForm.vue'
import SignInGoogleLink from '~/components/features/Auth/SignInGoogleLink.vue'
import { useMainStore } from '~/store/main/main'
import authApi from '~/api/auth/authApi'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const email = ref('')
const emailIsValid = (value: string) => value.length > 0
const password = ref('')
const passwordIsValid = (value: string) => value.length > 0
const rememberMe = ref(false)
const mainStore = useMainStore()
const { data, error, execute, pending } = authApi.signIn()
const errorText = ref<string | null>(null)
const verifyModal = ref(false)

async function submitHandler(event?: SubmitEventPromise) {
  const results = await event
  if (results?.valid === false) return

  execute({
    username: email.value,
    password: password.value,
    rememberMe: rememberMe.value,
  })
}

watch(error, () => {
  if (error.value)
    switch (error.value?.status) {
      case 410:
        errorText.value = t('userDeleted')
        break
      case 403:
        errorText.value = null
        verifyModal.value = true
        break
      case 401:
        errorText.value = t('wrongEmailOrPassword')
        break
      case undefined:
        errorText.value = null
        break
      default:
        errorText.value = getErrorText(error.value, locale.value)
    }
})

watch(data, () => {
  if (data.value) {
    mainStore.setProfile(data.value)
    router.push(
      route.query.return
        ? decodeURIComponent(String(route.query.return))
        : ROUTES.ui.home
    )
  }
})
</script>

<template>
  <Form @submit="submitHandler">
    <FormAlert v-if="errorText" :text="errorText" type="error" />
    <FormField
      v-model="email"
      :label="$t('email')"
      name="email"
      required
      :rules="[emailIsValid]"
      type="email"
    />
    <FormPassword
      v-model="password"
      :label="$t('password')"
      name="password"
      required
      :rules="[passwordIsValid]"
    />
    <FormCheckbox
      v-model="rememberMe"
      :label="$t('rememberMe')"
      name="rememberMe"
    />
    <FormButton
      block
      color="info"
      :loading="pending || Boolean(data)"
      type="submit"
    >
      {{ $t('signIn') }}
    </FormButton>
    <FormLink :href="ROUTES.ui.signUp" :text="$t('signUpText')" />
    <FormLink
      :href="ROUTES.ui.forgotPassword"
      :text="$t('forgotPasswordText')"
    />
    <SignInGoogleLink />
  </Form>
  <CustomModal v-model="verifyModal" :title="$t('verification')">
    <VerifyUserForm
      :email="email"
      @close="verifyModal = false"
      @success="submitHandler"
    />
  </CustomModal>
</template>
