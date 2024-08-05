<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import Form from '~/components/shared/kit/Form/Form.vue'
import FormAlert from '~/components/shared/kit/Form/FormAlert.vue'
import FormField from '~/components/shared/kit/Form/FormField.vue'
import FormPassword from '~/components/shared/kit/Form/FormPassword.vue'
import FormCheckbox from '~/components/shared/kit/Form/FormCheckbox.vue'
import FormButton from '~/components/shared/kit/Form/FormButton.vue'
import FormLink from '~/components/shared/kit/Form/FormLink.vue'
import CustomModal from '~/components/shared/kit/CustomModal/CustomModal.vue'
import VerifyUserForm from '~/components/entities/Forms/Auth/VerifyUserForm.vue'
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
const errorMsg = ref<string | null>(null)
const verifyModal = ref(false)

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (results.valid)
    execute({ username: email.value, password: password.value, rememberMe: rememberMe.value })
}

watch(
  error,
  () => {
    switch (error.value?.status) {
      case 410:
        errorMsg.value = t('userDeleted')
        break
      case 403:
        errorMsg.value = null
        verifyModal.value = true
        break
      case 401:
        errorMsg.value = t('wrongEmailOrPassword')
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
      mainStore.setProfile(data.value)
  },
)

watch(
  () => mainStore.profile,
  () => {
    if (mainStore.profile)
      router.push(route.query.return ? decodeURIComponent(String(route.query.return)) : ROUTES.panel.home)
  },
)
</script>

<template>
  <Form @submit="submitHandler">
    <FormAlert v-if="errorMsg" :text="errorMsg" type="error" />
    <FormField v-model="email" :label="$t('email')" name="email" required :rules="[emailIsValid]" />
    <FormPassword v-model="password" :label="$t('password')" name="password" required :rules="[passwordIsValid]" />
    <FormCheckbox v-model="rememberMe" :label="$t('rememberMe')" name="rememberMe" />
    <FormButton block color="info" :loading="pending || Boolean(data)" type="submit">
      {{ $t('signIn') }}
    </FormButton>
    <FormLink :href="ROUTES.auth.signUp" :text="$t('signUpText')" />
    <FormLink :href="ROUTES.auth.forget" :text="$t('forgotPasswordText')" />
  </Form>
  <CustomModal v-model="verifyModal" :title="$t('verification')">
    <VerifyUserForm :email="email" @close="verifyModal = false" />
  </CustomModal>
</template>
