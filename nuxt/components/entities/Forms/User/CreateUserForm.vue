<script setup lang="ts">
import Form from '~/components/shared/kit/Form/Form.vue'
import FormField from '~/components/shared/kit/Form/FormField.vue'
import FormPassword from '~/components/shared/kit/Form/FormPassword.vue'
import FormCheckbox from '~/components/shared/kit/Form/FormCheckbox.vue'
import FormButton from '~/components/shared/kit/Form/FormButton.vue'
import { useUsersStore } from '~/stores/users/users'
import { useMainStore } from '~/stores/main/main'

const { t, locale } = useI18n()
const email = ref('')
const emailIsValid = (value: string) => testString(EMAIL_REGEX, value) || t('emailValidation')
const name = ref('')
const nameIsValid = (value: string) => testString(NAME_REGEX, value) || t('nameValidation')
const password = ref('')
const passwordIsValid = (value: string) => testString(PASSWORD_REGEX, value) || t('passwordValidation')
const enabled = ref(true)
const usersStore = useUsersStore()
const mainStore = useMainStore()
const router = useRouter()
const rights = useRights(ROUTES.api.users)

function submitHandler() {
  if (
    emailIsValid(email.value) === true
    && nameIsValid(name.value) === true
    && passwordIsValid(password.value) === true) {
    usersStore.create({ email: email.value, name: name.value, password: password.value, enabled: enabled.value })
  }
}

watch(
  () => usersStore.createPending,
  () => {
    if (usersStore.createPending === true)
      return
    if (usersStore.createError)
      mainStore.addAlert({ type: 'error', text: makeErrorText(usersStore.createError, locale.value) })
    if (usersStore.createData) {
      mainStore.addAlert({ type: 'success', text: t('success') })
      router.push(ROUTES.panel.user(usersStore.createData.id))
    }
  },
)
</script>

<template>
  <Form @submit="submitHandler">
    <FormField
v-model:model-value="email" type="email" required name="email" :label="$t('email')"
      :rules="[emailIsValid]" :hint="$t('emailValidation')" />
    <FormField
v-model:model-value="name" required name="name" :label="$t('name')" :rules="[nameIsValid]"
      :hint="$t('nameValidation')" />
    <FormPassword
v-model:model-value="password" required name="password" :label="$t('password')"
      :rules="[passwordIsValid]" :hint="$t('passwordValidation')" />
    <FormCheckbox v-model:model-value="enabled" name="enabled" :label="$t('enabled')" />
    <FormButton
type="submit" color="info" prepand-icon="mdi-plus" :loading="usersStore.createPending"
      :disabled="!rights.creating">
      {{ $t('create') }}
    </FormButton>
  </Form>
</template>
