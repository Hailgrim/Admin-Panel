<script setup lang="ts">
import FormBox from '../FormBox.vue'
import FormAlert from '../FormAlert.vue'
import FormTextInput from '../FormTextInput.vue'
import FormPasswordInput from '../FormPasswordInput.vue'
import FormCheckbox from '../FormCheckbox.vue'
import FormButton from '../FormButton.vue'
import FormAuthLink from '../FormAuthLink.vue'
import CustomModal from '~/components/Other/CustomModal.vue'
import VerifyUser from '~/components/Forms/Auth/VerifyUser.vue'
import { useProfileStore } from '~/stores/profile'
import { makeErrorText } from '~/libs/functions'
import { ROUTES } from '~/libs/constants'

const { t } = useI18n()
const router = useRouter()
const email = ref('')
const emailIsValid = (value: string) => value.length > 0
const password = ref('')
const passwordIsValid = (value: string) => value.length > 0
const rememberMe = ref(false)
const profileStore = useProfileStore()
const errorMsg = ref<string | null>(null)
const verifyModal = ref(false)

function submitHandler() {
  if (emailIsValid(email.value) && passwordIsValid(password.value))
    profileStore.signIn({ username: email.value, password: password.value, rememberMe: rememberMe.value })
}

watch(
  () => profileStore.signInError,
  () => {
    switch (profileStore.signInError?.status) {
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
        errorMsg.value = makeErrorText(profileStore.signInError?.message)
    }
  },
)

watch(
  () => profileStore.profile,
  () => {
    if (profileStore.profile)
      router.push(ROUTES.panel.home)
  },
)
</script>

<template>
  <FormBox @submit="submitHandler">
    <FormAlert v-if="errorMsg" :title="$t('error')" :text="errorMsg" type="error" />
    <FormTextInput
      v-model:model-value="email" required name="email" :label="$t('email')"
      :rules="[emailIsValid]"
    />
    <FormPasswordInput
      v-model:model-value="password" required name="password" :label="$t('password')"
      :rules="[passwordIsValid]"
    />
    <FormCheckbox v-model:model-value="rememberMe" name="rememberMe" :label="$t('rememberMe')" />
    <FormButton block type="submit" color="info" :loading="profileStore.signInPending">
      {{ $t('signIn') }}
    </FormButton>
    <FormAuthLink :href="ROUTES.auth.signUp" :text="$t('signUpText')" />
    <FormAuthLink :href="ROUTES.auth.forget" :text="$t('forgotPasswordText')" />
  </FormBox>
  <CustomModal v-model="verifyModal" :title="$t('verification')">
    <VerifyUser :email="email" @close="verifyModal = false" />
  </CustomModal>
</template>
