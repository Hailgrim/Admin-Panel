<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import Form from '~/components/shared/kit/Form/Form.vue'
import FormField from '~/components/shared/kit/Form/FormField.vue'
import FormButton from '~/components/shared/kit/Form/FormButton.vue'
import { useMainStore } from '~/store/main/main'
import authApi from '~/api/auth/authApi'
import type { IUser } from '~/api/users/types'

const { t, locale } = useI18n()
const mainStore = useMainStore()
const newData = ref(mainStore.profile)
const { data, error, execute, pending } = authApi.updateProfile()
const nameIsValid = (value = '') => testString(NAME_REGEX, value) || t('nameValidation')
const rights = useRights(ROUTES.api.auth.profile)

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (newData.value && mainStore.profile && results.valid) {
    const updatedValues = getUpdatedValues<IUser>(
      mainStore.profile,
      newData.value,
    )

    if (Object.keys(updatedValues).length > 0)
      execute(updatedValues)
    else
      mainStore.addAlert({ type: 'warning', text: t('nothingToUpdate') })
  }
}

watch(
  pending,
  () => {
    if (pending.value) return

    if (error.value || data.value !== true)
      mainStore.addAlert({ type: 'error', text: makeErrorText(error.value, locale.value) })

    if (data.value) {
      mainStore.setProfile(newData.value)
      mainStore.addAlert({ type: 'success', text: t('success') })
    }
  },
)
</script>

<template>
  <Form @submit="submitHandler">
    <FormField
:label="$t('name')" :model-value="newData?.name" name="name" required :rules="[nameIsValid]"
      @update:model-value="newData && (newData = { ...newData, name: $event })" />
    <FormButton
color="success" :disabled="!rights.updating" :loading="pending" prepand-icon="mdi-content-save"
      type="submit">
      {{ $t('update') }}
    </FormButton>
  </Form>
</template>
