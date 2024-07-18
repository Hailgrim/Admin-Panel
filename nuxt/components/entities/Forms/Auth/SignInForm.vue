<script setup lang="ts">
import Form from '~/components/shared/kit/Form/Form.vue'
import FormAlert from '~/components/shared/kit/Form/FormAlert.vue'
import FormField from '~/components/shared/kit/Form/FormField.vue'
import FormPassword from '~/components/shared/kit/Form/FormPassword.vue'
import FormCheckbox from '~/components/shared/kit/Form/FormCheckbox.vue'
import FormButton from '~/components/shared/kit/Form/FormButton.vue'
import FormLink from '~/components/shared/kit/Form/FormLink.vue'
import CustomModal from '~/components/shared/kit/CustomModal/CustomModal.vue'
import VerifyForm from '~/components/entities/Forms/Auth/VerifyForm.vue'
import { useAuthStore } from '~/stores/auth/auth'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const email = ref('')
const emailIsValid = (value: string) => value.length > 0
const password = ref('')
const passwordIsValid = (value: string) => value.length > 0
const rememberMe = ref(false)
const authStore = useAuthStore()
const errorMsg = ref<string | null>(null)
const verifyModal = ref(false)

function formHandler() {
  if (emailIsValid(email.value) && passwordIsValid(password.value))
    authStore.signIn({ username: email.value, password: password.value, rememberMe: rememberMe.value })
}

watch(
  () => authStore.signInError,
  () => {
    switch (authStore.signInError?.status) {
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
        errorMsg.value = makeErrorText(authStore.signInError?.message, locale.value)
    }
  },
)

watch(
  () => authStore.profile,
  () => {
    if (authStore.profile)
      router.push(route.query.return ? decodeURIComponent(String(route.query.return)) : ROUTES.panel.home)
  },
)
</script>

<template>
  <Form @submit="formHandler">
    <FormAlert v-if="errorMsg" :text="errorMsg" type="error" />
    <FormField v-model:model-value="email" required name="email" :label="$t('email')" :rules="[emailIsValid]" />
    <FormPassword
v-model:model-value="password" required name="password" :label="$t('password')"
      :rules="[passwordIsValid]" />
    <FormCheckbox v-model:model-value="rememberMe" name="rememberMe" :label="$t('rememberMe')" />
    <FormButton block type="submit" color="info" :loading="authStore.signInPending">
      {{ $t('signIn') }}
    </FormButton>
    <FormLink :href="ROUTES.auth.signUp" :text="$t('signUpText')" />
    <FormLink :href="ROUTES.auth.forget" :text="$t('forgotPasswordText')" />
  </Form>
  <CustomModal v-model="verifyModal" :title="$t('verification')">
    <VerifyForm :email="email" @close="verifyModal = false" />
  </CustomModal>
</template>
