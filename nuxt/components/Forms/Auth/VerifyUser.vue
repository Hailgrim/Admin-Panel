<script setup lang="ts">
import FormBox from '../FormBox.vue'
import FormAlert from '../FormAlert.vue'
import FormTextInput from '../FormTextInput.vue'
import FormButton from '../FormButton.vue'
import { useProfileStore } from '~/stores/profile'
import { makeErrorText } from '~/libs/functions'

const props = defineProps<{
  email: string
}>()
const emits = defineEmits(['close'])

const { t } = useI18n()
const code = ref('')
const codeIsValid = (value: string) => value.length > 0
const profileStore = useProfileStore()
const errorMsg = ref<string | null>(null)

function submitHandler() {
  if (codeIsValid(code.value))
    profileStore.verify({ email: props.email, code: code.value })
}

watch(
  () => profileStore.verifyError,
  () => {
    switch (profileStore.verifyError?.status) {
      case 404:
        errorMsg.value = t('wrongCode')
        break
      case undefined:
        errorMsg.value = null
        break
      default:
        errorMsg.value = makeErrorText(profileStore.verifyError?.message)
    }
  },
)

watch(
  () => profileStore.verifyResult,
  () => {
    if (profileStore.verifyResult)
      emits('close')
  },
)
</script>

<template>
  <FormBox @submit="submitHandler">
    <FormAlert v-if="errorMsg" :title="$t('error')" :text="errorMsg" type="error" />
    <FormTextInput
      v-model:model-value="code" required name="code" :label="$t('code')"
      :rules="[codeIsValid]"
    />
    <FormButton block type="submit" color="success" :loading="profileStore.verifyLoading">
      {{ $t('confirm') }}
    </FormButton>
    <FormButton block type="button" color="error" @click="$emit('close')">
      {{ $t('close') }}
    </FormButton>
  </FormBox>
</template>
