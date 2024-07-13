<script setup lang="ts">
import Form from '~/components/kit/Form/Form.vue'
import FormAlert from '~/components/kit/Form/FormAlert.vue'
import FormField from '~/components/kit/Form/FormField.vue'
import FormButton from '~/components/kit/Form/FormButton.vue'
import { useAuthStore } from '~/stores/auth/auth'

const props = defineProps<{
  email: string
}>()
const emits = defineEmits(['close'])

const { t, locale } = useI18n()
const code = ref('')
const codeIsValid = (value: string) => value.length > 0 || `${t('codeFromEmail')} (${props.email})`
const authStore = useAuthStore()
const errorMsg = ref<string | null>(null)

function formHandler() {
  if (codeIsValid(code.value) === true)
    authStore.verify({ email: props.email, code: code.value })
}

watch(
  () => authStore.verifyError,
  () => {
    switch (authStore.verifyError?.status) {
      case 404:
        errorMsg.value = t('wrongCode')
        break
      case undefined:
        errorMsg.value = null
        break
      default:
        errorMsg.value = makeErrorText(authStore.verifyError?.message, locale.value)
    }
  },
)

watch(
  () => authStore.verifyData,
  () => {
    if (authStore.verifyData)
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
    <FormButton block type="submit" color="success" :loading="authStore.verifyPending">
      {{ $t('confirm') }}
    </FormButton>
    <FormButton block type="button" color="error" @click="$emit('close')">
      {{ $t('close') }}
    </FormButton>
  </Form>
</template>
