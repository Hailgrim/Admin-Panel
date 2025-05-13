<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

const { t, locale } = useI18n()
const mainStore = useMainStore()
const email = ref(mainStore.profile?.email || '')
const emailIsValid = (value: string) =>
  value.length > 0 || t('emailValidationI18N')
const { data, error, execute, pending, args } = profileApi.changeEmailRequest()
const confirmModal = ref(false)
const rights = useRights(ROUTES.api.profile)

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (results.valid) {
    if (email.value === mainStore.profile?.email)
      mainStore.addAlert({ type: 'warning', text: t('nothingToUpdate') })
    else execute({ newEmail: email.value })
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
  if (data.value) confirmModal.value = true
})
</script>

<template>
  <FormBase @submit="submitHandler">
    <FormField
      v-model="email"
      :hint="$t('emailValidationI18N')"
      :label="$t('email')"
      name="email"
      required
      :rules="[emailIsValid]"
      type="email"
    />
    <FormButton
      color="success"
      :disabled="!rights.updating"
      :loading="pending"
      type="submit"
    >
      {{ $t('change') }}
    </FormButton>
    <CustomModal
      v-model="confirmModal"
      :title="$t('resetPassword')"
    >
      <ChangeEmailConfirmForm
        :email="args?.newEmail || ''"
        @close="confirmModal = false"
      />
    </CustomModal>
  </FormBase>
</template>
