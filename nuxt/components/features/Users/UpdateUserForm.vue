<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

const { user } = defineProps<{ user: IUser }>()

const { t, locale } = useI18n()
const rights = useRights(ROUTES.api.users)
const mainStore = useMainStore()
const router = useRouter()
const oldData = ref<IUser>(user)
const newData = ref<IUser>(user)
const updatedValues = ref<TUpdateUser>({})
const emailIsValid = (value: string) =>
  testString(EMAIL_REGEX, value) || t('emailValidationI18N')
const nameIsValid = (value: string) =>
  testString(NAME_REGEX, value) || t('nameValidation')
const {
  error: uError,
  execute: uExecute,
  status: uStatus,
} = usersApi.update({
  id: user.id,
  fields: updatedValues,
})
const {
  error: dError,
  execute: dExecute,
  status: dStatus,
} = usersApi.delete({ items: [user.id] })

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (!results.valid) {
    return
  }

  updatedValues.value = getUpdatedValues<IUser>(oldData.value, newData.value)

  if (Object.keys(updatedValues.value).length > 0) {
    uExecute()
  }
  else {
    mainStore.addAlert({ type: 'warning', text: t('nothingToUpdate') })
  }
}

watch(uError, () => {
  if (!uError.value) {
    return
  }

  mainStore.addAlert({
    type: 'error',
    text: getErrorText(uError.value, locale.value),
  })
})

watch(uStatus, () => {
  if (uStatus.value === 'success') {
    oldData.value = newData.value
    mainStore.addAlert({ type: 'success', text: t('success') })
  }
})

watch(dError, () => {
  if (!dError.value) {
    return
  }

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
      @click="dExecute()"
    >
      {{ $t('delete') }}
    </FormButton>
  </FormBase>
</template>
