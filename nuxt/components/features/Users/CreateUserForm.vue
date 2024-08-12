<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import Form from '~/components/shared/ui/Form/Form.vue'
import FormField from '~/components/shared/ui/Form/FormField.vue'
import FormPassword from '~/components/shared/ui/Form/FormPassword.vue'
import FormCheckbox from '~/components/shared/ui/Form/FormCheckbox.vue'
import FormButton from '~/components/shared/ui/Form/FormButton.vue'
import { useMainStore } from '~/store/main/main'
import usersApi from '~/api/users/usersApi'
import type { IUserCreate } from '~/api/users/types'

const { t, locale } = useI18n()
const newData = ref<IUserCreate>({
  email: '',
  name: '',
  password: '',
  enabled: false
})
const emailIsValid = (value: string) => testString(EMAIL_REGEX, value) || t('emailValidation')
const nameIsValid = (value: string) => testString(NAME_REGEX, value) || t('nameValidation')
const passwordIsValid = (value: string) => testString(PASSWORD_REGEX, value) || t('passwordValidation')
const { data, error, execute, pending } = usersApi.create()
const mainStore = useMainStore()
const router = useRouter()
const rights = useRights(ROUTES.api.users)

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (results.valid)
    execute(newData.value)
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
    if (data.value) {
      mainStore.addAlert({ type: 'success', text: t('success') })
      router.push(ROUTES.ui.user(data.value.id))
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
    <FormPassword
:hint="$t('passwordValidation')" :label="$t('password')" :model-value="newData.password"
      name="password" required :rules="[passwordIsValid]"
      @update:model-value="newData = { ...newData, password: $event }" />
    <FormCheckbox
:label="$t('enabled')" :model-value="newData.enabled" name="enabled"
      @update:model-value="newData = { ...newData, enabled: $event }" />
    <FormButton
color="info" :disabled="!rights.creating" :loading="pending || Boolean(data)" prepand-icon="mdi-plus"
      type="submit">
      {{ $t('create') }}
    </FormButton>
  </Form>
</template>
