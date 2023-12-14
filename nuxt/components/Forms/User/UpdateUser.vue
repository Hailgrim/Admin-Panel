<script setup lang="ts">
import FormBox from '../FormBox.vue'
import FormTextField from '../FormTextField.vue'
import FormCheckbox from '../FormCheckbox.vue'
import FormButton from '../FormButton.vue'
import { useUsersStore } from '~/stores/users'
import { useMainStore } from '~/stores/main'
import type { IUser } from '~/utils/types'

const { user } = defineProps<{ user: IUser }>()

const { t, locale } = useI18n()
const usersStore = useUsersStore()
const email = ref(user.email)
const emailIsValid = (value: string) => testString(EMAIL_REGEX, value) || t('emailValidation')
const name = ref(user.name)
const nameIsValid = (value: string) => testString(NAME_REGEX, value) || t('nameValidation')
const enabled = ref(user.enabled)
const mainStore = useMainStore()
const rights = useRights(ROUTES.api.users)

function submitHandler() {
  if (emailIsValid(email.value) && nameIsValid(name.value)) {
    usersStore.update({
      id: user.id,
      fields: { email: email.value, name: name.value, enabled: enabled.value },
    })
  }
}

watch(
  () => usersStore.updatePending,
  () => {
    if (usersStore.updatePending === true)
      return
    if (usersStore.updateError)
      mainStore.addAlert({ type: 'error', text: makeErrorText(usersStore.updateError, locale.value) })
    if (usersStore.updateData)
      mainStore.addAlert({ type: 'success', text: t('success') })
  },
)
</script>

<template>
  <FormBox @submit="submitHandler">
    <FormTextField
      v-model:model-value="email" type="email" required name="email" :label="$t('email')"
      :rules="[emailIsValid]" :hint="$t('emailValidation')"
    />
    <FormTextField
      v-model:model-value="name" required name="name" :label="$t('name')"
      :rules="[nameIsValid]" :hint="$t('nameValidation')"
    />
    <FormCheckbox v-model:model-value="enabled" name="enabled" :label="$t('enabled')" />
    <FormButton
      type="submit" color="success" prepand-icon="mdi-content-save" :loading="usersStore.updatePending"
      :disabled="!rights.updating"
    >
      {{ $t('update') }}
    </FormButton>
  </FormBox>
</template>
