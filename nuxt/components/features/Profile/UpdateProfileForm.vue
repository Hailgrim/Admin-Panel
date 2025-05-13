<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

const { t, locale } = useI18n()
const mainStore = useMainStore()
const { email, ...profile } = mainStore.profile || ({} as Partial<IUser>)
const newData = ref(profile)
const { data, error, execute, pending } = profileApi.updateProfile()
const nameIsValid = (value = '') =>
  testString(NAME_REGEX, value) || t('nameValidation')
const rights = useRights(ROUTES.api.profile)

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (newData.value && mainStore.profile && results.valid) {
    const updatedValues = getUpdatedValues<IUser>(
      mainStore.profile,
      newData.value,
    )

    if (Object.keys(updatedValues).length > 0) execute(updatedValues)
    else mainStore.addAlert({ type: 'warning', text: t('nothingToUpdate') })
  }
}

watch(error, () => {
  if (error.value)
    mainStore.addAlert({
      type: 'error',
      text: getErrorText(error.value, locale.value),
    })
})

watch(data, () => {
  if (data.value) {
    if (mainStore.profile)
      mainStore.setProfile({ ...mainStore.profile, ...newData.value })
    mainStore.addAlert({ type: 'success', text: t('success') })
  }
})
</script>

<template>
  <FormBase @submit="submitHandler">
    <FormField
      v-if="mainStore.profile?.googleId"
      disabled
      :label="$t('googleId')"
      :model-value="mainStore.profile.googleId"
      name="googleId"
    />
    <FormField
      :label="$t('name')"
      :model-value="newData.name"
      name="name"
      required
      :rules="[nameIsValid]"
      @update:model-value="newData && (newData = { ...newData, name: $event })"
    />
    <FormButton
      color="success"
      :disabled="!rights.updating"
      :loading="pending"
      prepand-icon="mdi-content-save"
      type="submit"
    >
      {{ $t('update') }}
    </FormButton>
  </FormBase>
</template>
