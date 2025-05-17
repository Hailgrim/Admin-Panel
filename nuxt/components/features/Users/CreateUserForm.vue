<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

const { t, locale } = useI18n()
const newData = ref<TCreateUser>({
  email: '',
  name: '',
  password: '',
  enabled: false,
})
const emailIsValid = (value: string) =>
  testString(EMAIL_REGEX, value) || t('emailValidationI18N')
const nameIsValid = (value: string) =>
  testString(NAME_REGEX, value) || t('nameValidation')
const passwordIsValid = (value: string) =>
  testString(PASSWORD_REGEX, value) || t('passwordValidation')
const { data, error, execute, status } = usersApi.create()
const mainStore = useMainStore()
const router = useRouter()
const rights = useRights(ROUTES.api.users)

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (results.valid) execute(newData.value)
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
    mainStore.addAlert({ type: 'success', text: t('success') })
    router.push(ROUTES.ui.user(data.value.id))
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
      required
      :rules="[emailIsValid]"
      type="email"
      @update:model-value="newData = { ...newData, email: $event || '' }"
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
    <FormPassword
      :hint="$t('passwordValidation')"
      :label="$t('password')"
      :model-value="newData.password || undefined"
      name="password"
      required
      :rules="[passwordIsValid]"
      @update:model-value="newData = { ...newData, password: $event || '' }"
    />
    <FormCheckbox
      :label="$t('enabled')"
      :model-value="newData.enabled"
      name="enabled"
      @update:model-value="newData = { ...newData, enabled: Boolean($event) }"
    />
    <FormButton
      color="info"
      :disabled="!rights.creating"
      :loading="status === 'pending' || Boolean(data)"
      prepand-icon="mdi-plus"
      type="submit"
    >
      {{ $t('create') }}
    </FormButton>
  </FormBase>
</template>
