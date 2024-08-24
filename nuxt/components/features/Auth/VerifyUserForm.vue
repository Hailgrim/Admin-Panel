<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import Form from '~/components/shared/ui/Form/Form.vue'
import FormAlert from '~/components/shared/ui/Form/FormAlert.vue'
import FormField from '~/components/shared/ui/Form/FormField.vue'
import FormButton from '~/components/shared/ui/Form/FormButton.vue'
import authApi from '~/api/auth/authApi'

const { email } = defineProps<{
  email: string
}>()
const emit = defineEmits<{
  close: []
  success: []
}>()

const { t, locale } = useI18n()
const code = ref('')
const codeIsValid = (value: string) => value.length > 0 || `${t('codeFromEmail')} (${email})`
const { data, error, execute, pending } = authApi.verify()

const errorText = ref<string | null>(null)

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (results.valid)
    execute({ email: email, code: code.value })
}

watch(
  error,
  () => {
    if (error.value)
      switch (error.value?.status) {
        case 404:
          errorText.value = t('wrongCode')
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
      emit('success')
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
    <FormButton block color="success" :loading="pending || Boolean(data)" type="submit">
      {{ $t('confirm') }}
    </FormButton>
    <FormButton block color="error" type="button" @click="$emit('close')">
      {{ $t('close') }}
    </FormButton>
  </Form>
</template>
