<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import Form from '~/components/shared/kit/Form/Form.vue'
import FormField from '~/components/shared/kit/Form/FormField.vue'
import FormCheckbox from '~/components/shared/kit/Form/FormCheckbox.vue'
import FormButton from '~/components/shared/kit/Form/FormButton.vue'
import { useMainStore } from '~/store/main/main'
import usersApi from '~/api/users/usersApi'
import type { IUser } from '~/api/users/types'

const { user } = defineProps<{ user: IUser }>()

const { t, locale } = useI18n()
const {
  data: uData,
  error: uError,
  execute: uExecute,
  pending: uPending,
} = usersApi.update()
const {
  data: dData,
  error: dError,
  execute: dExecute,
  pending: dPending,
} = usersApi.delete()
const oldData = ref<IUser>(user)
const newData = ref<IUser>(user)
const emailIsValid = (value: string) => testString(EMAIL_REGEX, value) || t('emailValidation')
const nameIsValid = (value: string) => testString(NAME_REGEX, value) || t('nameValidation')
const mainStore = useMainStore()
const rights = useRights(ROUTES.api.users)
const router = useRouter()

async function submitHandler(event: SubmitEventPromise) {
  const results = await event
  const updatedValues = getUpdatedValues<IUser>(
    oldData.value,
    newData.value,
  )

  if (results.valid && Object.keys(updatedValues).length > 0) {
    uExecute({
      id: user.id,
      fields: updatedValues,
    })
  }
}

watch(
  uPending,
  () => {
    if (uPending.value) return

    if (uError.value)
      mainStore.addAlert({ type: 'error', text: makeErrorText(uError.value, locale.value) })

    if (uData.value)
      mainStore.addAlert({ type: 'success', text: t('success') })
  },
)

watch(
  dPending,
  () => {
    if (dPending.value) return

    if (dError.value)
      mainStore.addAlert({ type: 'error', text: makeErrorText(dError.value, locale.value) })

    if (dData.value) {
      mainStore.addAlert({ type: 'success', text: t('success') })
      router.push(ROUTES.panel.users)
    }
  },
)
</script>

<template>
  <Form @submit="submitHandler">
    <FormField
:hint="$t('emailValidation')" :label="$t('email')" :model-value="newData.email" name="email" required
      :rules="[emailIsValid]" type="email" @update:model-value="newData = { ...newData, email: $event }" />
    <FormField
:hint="$t('nameValidation')" :label="$t('name')" :model-value="newData.name" name="name" required
      :rules="[nameIsValid]" @update:model-value="newData = { ...newData, name: $event }" />
    <FormCheckbox
:label="$t('enabled')" :model-value="newData.enabled" name="enabled"
      @update:model-value="newData = { ...newData, enabled: $event }" />
    <FormButton
color="success" :disabled="!rights.updating || dPending || Boolean(dData)" :loading="uPending"
      prepand-icon="mdi-content-save" type="submit">
      {{ $t('update') }}
    </FormButton>
    <FormButton
color="error" :disabled="!rights.deleting || user.roles?.some((role) => role.admin)"
      :loading="dPending || Boolean(dData)" prepand-icon="mdi-delete" type="button" @click="dExecute(user.id)">
      {{ $t('delete') }}
    </FormButton>
  </Form>
</template>
