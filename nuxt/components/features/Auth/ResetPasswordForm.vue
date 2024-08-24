<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import Form from '~/components/shared/ui/Form/Form.vue'
import FormAlert from '~/components/shared/ui/Form/FormAlert.vue'
import FormField from '~/components/shared/ui/Form/FormField.vue'
import FormPassword from '~/components/shared/ui/Form/FormPassword.vue'
import FormButton from '~/components/shared/ui/Form/FormButton.vue'
import authApi from '~/api/auth/authApi'

const { email } = defineProps<{
  email: string
}>()
const emit = defineEmits<{
  close: []
}>()

const { t, locale } = useI18n()
const code = ref('')
const codeIsValid = (value: string) => value.length > 0 || `${t('codeFromEmail')} (${email})`
const password = ref('')
const passwordIsValid = (value: string) => testString(PASSWORD_REGEX, value) || t('passwordValidation')
const { data, error, execute, pending } = authApi.resetPassword()
const errorText = ref<string | null>(null)
const router = useRouter()

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (results.valid)
    execute({ email: email, password: password.value, code: code.value })
}

watch(
  error,
  () => {
    if (error.value)
      switch (error.value?.status) {
        case 404:
          errorText.value = t('wrongEmailOrCode')
          break
        case undefined:
          errorText.value = null
          break
        default:
          errorText.value = makeErrorText(error.value, locale.value)
      }
  },
)

watch(
  data,
  () => {
    if (data.value) {
      emit('close')
      router.push(ROUTES.ui.signIn)
    }
  },
)
</script>

<template>
  <Form @submit="submitHandler">
    <FormAlert v-if="errorText" :text="errorText" type="error" />
    <FormField
v-model="code" :hint="`${$t('codeFromEmail')} (${email})`" :label="$t('code')" name="code" required
      :rules="[codeIsValid]" />
    <FormPassword
v-model="password" :hint="$t('passwordValidation')" :label="$t('newPassword')" name="password"
      required :rules="[passwordIsValid]" />
    <FormButton block color="success" :loading="pending || Boolean(data)" type="submit">
      {{ $t('confirm') }}
    </FormButton>
    <FormButton block color="error" type="button" @click="$emit('close')">
      {{ $t('close') }}
    </FormButton>
  </Form>
</template>
