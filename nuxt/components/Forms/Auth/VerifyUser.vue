<script setup lang="ts">
import FormBox from '../FormBox.vue'
import FormAlert from '../FormAlert.vue'
import FormTextField from '../FormTextField.vue'
import FormButton from '../FormButton.vue'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
  email: string
}>()
const emits = defineEmits(['close'])

const { t, locale } = useI18n()
const code = ref('')
const codeIsValid = (value: string) => value.length > 0 || `${t('codeFromEmail')} (${props.email})`
const authStore = useAuthStore()
const errorMsg = ref<string | null>(null)

function submitHandler() {
  if (codeIsValid(code.value))
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
  <FormBox @submit="submitHandler">
    <FormAlert v-if="errorMsg" :title="$t('error')" :text="errorMsg" type="error" />
    <FormTextField
      v-model:model-value="code" required name="code" :label="$t('code')"
      :hint="`${$t('codeFromEmail')} (${email})`" :rules="[codeIsValid]"
    />
    <FormButton block type="submit" color="success" :loading="authStore.verifyPending">
      {{ $t('confirm') }}
    </FormButton>
    <FormButton block type="button" color="error" @click="$emit('close')">
      {{ $t('close') }}
    </FormButton>
  </FormBox>
</template>
