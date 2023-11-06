<script setup lang="ts">
import FormBox from '../FormBox.vue'
import FormAlert from '../FormAlert.vue'
import FormTextInput from '../FormTextInput.vue'
import FormPasswordInput from '../FormPasswordInput.vue'
import FormButton from '../FormButton.vue'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
  email: string
}>()
const emits = defineEmits(['close'])

const { t } = useI18n()
const code = ref('')
const codeIsValid = (value: string) => value.length > 0 || `${t('codeFromEmail')} (${props.email})`
const password = ref('')
const passwordIsValid = (value: string) => testString(PASSWORD_REGEX, value) || t('passwordValidation')
const authStore = useAuthStore()
const errorMsg = ref<string | null>(null)

function submitHandler() {
  if (codeIsValid(code.value) && passwordIsValid(password.value))
    authStore.resetPassword({ email: props.email, password: password.value, code: code.value })
}

watch(
  () => authStore.resetPasswordError,
  () => {
    switch (authStore.resetPasswordError?.status) {
      case 404:
        errorMsg.value = t('wrongEmailOrCode')
        break
      case undefined:
        errorMsg.value = null
        break
      default:
        errorMsg.value = makeErrorText(authStore.resetPasswordError?.message)
    }
  },
)

watch(
  () => authStore.resetPasswordData,
  () => {
    if (authStore.resetPasswordData)
      emits('close')
  },
)
</script>

<template>
  <FormBox @submit="submitHandler">
    <FormAlert v-if="errorMsg" :title="$t('error')" :text="errorMsg" type="error" />
    <FormTextInput
      v-model:model-value="code" required name="code" :label="$t('code')"
      :hint="`${$t('codeFromEmail')} (${email})`" :rules="[codeIsValid]"
    />
    <FormPasswordInput
      v-model:model-value="password" required name="password"
      :label="$t('newPassword')" :rules="[passwordIsValid]" :hint="$t('passwordValidation')"
    />
    <FormButton block type="submit" color="success" :loading="authStore.resetPasswordPending">
      {{ $t('confirm') }}
    </FormButton>
    <FormButton block type="button" color="error" @click="$emit('close')">
      {{ $t('close') }}
    </FormButton>
  </FormBox>
</template>
