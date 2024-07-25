<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import Form from '~/components/shared/kit/Form/Form.vue'
import FormAlert from '~/components/shared/kit/Form/FormAlert.vue'
import FormField from '~/components/shared/kit/Form/FormField.vue'
import FormButton from '~/components/shared/kit/Form/FormButton.vue'
import authApi from '~/api/auth/authApi'

const props = defineProps<{
  email: string
}>()
const emits = defineEmits(['close'])

const { t, locale } = useI18n()
const code = ref('')
const codeIsValid = (value: string) => value.length > 0 || `${t('codeFromEmail')} (${props.email})`
const { data, error, execute, pending } = authApi.verify()

const errorMsg = ref<string | null>(null)

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (results.valid)
    execute({ email: props.email, code: code.value })
}

watch(
  error,
  () => {
    switch (error.value?.status) {
      case 404:
        errorMsg.value = t('wrongCode')
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
      emits('close')
  },
)
</script>

<template>
  <Form @submit="submitHandler">
    <FormAlert v-if="errorMsg" :text="errorMsg" type="error" />
    <FormField
v-model="code" :hint="`${$t('codeFromEmail')} (${email})`" :label="$t('code')" name="code" required
      :rules="[codeIsValid]" />
    <FormButton block color="success" :loading="pending || !!data" type="submit">
      {{ $t('confirm') }}
    </FormButton>
    <FormButton block color="error" type="button" @click="$emit('close')">
      {{ $t('close') }}
    </FormButton>
  </Form>
</template>
