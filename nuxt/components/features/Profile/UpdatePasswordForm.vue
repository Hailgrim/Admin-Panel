<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import Form from '~/components/shared/ui/Form/Form.vue'
import FormPassword from '~/components/shared/ui/Form/FormPassword.vue'
import FormButton from '~/components/shared/ui/Form/FormButton.vue'
import { useMainStore } from '~/store/main/main'
import profileApi from '~/api/profile/profileApi'

const { t, locale } = useI18n()
const mainStore = useMainStore()
const { data, error, execute, pending } = profileApi.updatePassword()
const oldPassword = ref('')
const newPassword = ref('')
const passwordIsValid = (value: string) => testString(PASSWORD_REGEX, value) || t('passwordValidation')
const rights = useRights(ROUTES.api.profile)

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (results.valid) {
    if (oldPassword.value === newPassword.value)
      mainStore.addAlert({ type: 'warning', text: t('nothingToUpdate') })
    else
      execute({ oldPassword: oldPassword.value, newPassword: newPassword.value })
  }
}

watch(
  error,
  () => {
    if (error.value)
      mainStore.addAlert({ type: 'error', text: makeErrorText(error.value, locale.value) })
  },
)

watch(
  data,
  () => {
    if (data.value)
      mainStore.addAlert({ type: 'success', text: t('success') })
  },
)
</script>

<template>
  <Form @submit="submitHandler">
    <FormPassword v-model="oldPassword" :label="$t('newPassword')" name="old-password" />
    <FormPassword
v-model="newPassword" :hint="$t('passwordValidation')" :label="$t('oldPassword')" name="new-password"
      required :rules="[passwordIsValid]" />
    <FormButton
color="success" :disabled="!rights.updating" :loading="pending" prepand-icon="mdi-content-save"
      type="submit">
      {{ $t('update') }}
    </FormButton>
  </Form>
</template>
