<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import Form from '~/components/shared/ui/Form/Form.vue'
import FormField from '~/components/shared/ui/Form/FormField.vue'
import FormButton from '~/components/shared/ui/Form/FormButton.vue'
import profileApi from '~/api/profile/profileApi'
import { useMainStore } from '~/store/main/main'

const { email } = defineProps<{
  email: string
}>()
const emit = defineEmits<{
  close: []
}>()

const { t, locale } = useI18n()
const mainStore = useMainStore()
const code = ref('')
const codeIsValid = (value: string) => value.length > 0 || `${t('codeFromEmail')} (${email})`
const { data, error, execute, pending } = profileApi.changeEmailConfirm()
const rights = useRights(ROUTES.api.profile)

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (results.valid)
    execute(code.value)
}

watch(
  error,
  () => {
    console.log(error.value?.status)
    if (error.value)
      switch (error.value?.status) {
        case 404:
          mainStore.addAlert({ type: 'error', text: t('wrongEmailOrCode') })
          break
        default:
          mainStore.addAlert({ type: 'error', text: makeErrorText(error.value, locale.value) })
      }
  },
)

watch(
  data,
  () => {
    if (data.value) {
      emit('close')
      if (mainStore.profile)
        mainStore.setProfile({ ...mainStore.profile, email })
    }
  },
)
</script>

<template>
  <Form @submit="submitHandler">
    <FormField
v-model="code" :hint="`${$t('codeFromEmail')} (${email})`" :label="$t('code')" name="code" required
      :rules="[codeIsValid]" />
    <FormButton block color="success" :disabled="!rights.updating" :loading="pending || Boolean(data)" type="submit">
      {{ $t('confirm') }}
    </FormButton>
    <FormButton block color="error" type="button" @click="$emit('close')">
      {{ $t('close') }}
    </FormButton>
  </Form>
</template>
