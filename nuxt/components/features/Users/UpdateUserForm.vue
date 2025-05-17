<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

const { user } = defineProps<{ user: IUser }>()

const { t, locale } = useI18n()
const {
  error: uError,
  execute: uExecute,
  status: uStatus,
} = usersApi.update()
const {
  error: dError,
  execute: dExecute,
  status: dStatus,
} = usersApi.delete()
const oldData = ref<IUser>(user)
const newData = ref<IUser>(user)
const emailIsValid = (value: string) =>
  testString(EMAIL_REGEX, value) || t('emailValidationI18N')
const nameIsValid = (value: string) =>
  testString(NAME_REGEX, value) || t('nameValidation')
const mainStore = useMainStore()
const rights = useRights(ROUTES.api.users)
const router = useRouter()

async function submitHandler(event: SubmitEventPromise) {
  const results = await event
  const updatedValues = getUpdatedValues<IUser>(oldData.value, newData.value)

  if (results.valid && Object.keys(updatedValues).length > 0) {
    uExecute({
      id: user.id,
      fields: updatedValues,
    })
  }
}

watch(uError, () => {
  if (uError.value)
    mainStore.addAlert({
      type: 'error',
      text: getErrorText(uError.value, locale.value),
    })
})

watch(uStatus, () => {
  if (uStatus.value === 'success') mainStore.addAlert({ type: 'success', text: t('success') })
})

watch(dError, () => {
  if (dError.value)
    mainStore.addAlert({
      type: 'error',
      text: getErrorText(dError.value, locale.value),
    })
})

watch(dStatus, () => {
  if (dStatus.value === 'success') {
    mainStore.addAlert({ type: 'success', text: t('success') })
    router.push(ROUTES.ui.users)
  }
})
</script>

<template>
  <FormBase @submit="submitHandler">
    <FormField
      :hint="$t('emailValidationI18N')"
      :label="$t('email')"
      :model-value="newData.email || undefined"
      name="email"
      :rules="[emailIsValid]"
      type="email"
      @update:model-value="newData = { ...newData, email: $event }"
    />
    <FormField
      :hint="$t('nameValidation')"
      :label="$t('name')"
      :model-value="newData.name"
      name="name"
      required
      :rules="[nameIsValid]"
      @update:model-value="newData = { ...newData, name: $event || '' }"
    />
    <FormCheckbox
      :label="$t('enabled')"
      :model-value="newData.enabled"
      name="enabled"
      @update:model-value="newData = { ...newData, enabled: Boolean($event) }"
    />
    <FormButton
      color="success"
      :disabled="!rights.updating || dStatus === 'pending' || dStatus === 'success'"
      :loading="uStatus === 'pending'"
      prepand-icon="mdi-content-save"
      type="submit"
    >
      {{ $t('update') }}
    </FormButton>
    <FormButton
      color="error"
      :disabled="!rights.deleting || user.roles?.some((role) => role.admin)"
      :loading="dStatus === 'pending' || dStatus === 'success'"
      prepand-icon="mdi-delete"
      type="button"
      @click="dExecute({ items: [user.id] })"
    >
      {{ $t('delete') }}
    </FormButton>
  </FormBase>
</template>
