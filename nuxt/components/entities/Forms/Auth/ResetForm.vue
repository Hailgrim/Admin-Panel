<script setup lang="ts">
import Form from '~/components/shared/kit/Form/Form.vue'
import FormAlert from '~/components/shared/kit/Form/FormAlert.vue'
import FormField from '~/components/shared/kit/Form/FormField.vue'
import FormPassword from '~/components/shared/kit/Form/FormPassword.vue'
import FormButton from '~/components/shared/kit/Form/FormButton.vue'
import { useAuthStore } from '~/stores/auth/auth'

const props = defineProps<{
  email: string
}>()
const emits = defineEmits(['close'])

const { t, locale } = useI18n()
const code = ref('')
const codeIsValid = (value: string) => value.length > 0 || `${t('codeFromEmail')} (${props.email})`
const password = ref('')
const passwordIsValid = (value: string) => testString(PASSWORD_REGEX, value) || t('passwordValidation')
const authStore = useAuthStore()
const errorMsg = ref<string | null>(null)

function formHandler() {
  if (codeIsValid(code.value) === true && passwordIsValid(password.value) === true)
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
        errorMsg.value = makeErrorText(authStore.resetPasswordError?.message, locale.value)
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
  <Form @submit="formHandler">
    <FormAlert v-if="errorMsg" :text="errorMsg" type="error" />
    <FormField
v-model:model-value="code" required name="code" :label="$t('code')"
      :hint="`${$t('codeFromEmail')} (${email})`" :rules="[codeIsValid]" />
    <FormPassword
v-model:model-value="password" required name="password" :label="$t('newPassword')"
      :rules="[passwordIsValid]" :hint="$t('passwordValidation')" />
    <FormButton block type="submit" color="success" :loading="authStore.resetPasswordPending">
      {{ $t('confirm') }}
    </FormButton>
    <FormButton block type="button" color="error" @click="$emit('close')">
      {{ $t('close') }}
    </FormButton>
  </Form>
</template>
