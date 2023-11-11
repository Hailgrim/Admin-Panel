<script setup lang="ts">
import FormBox from '../FormBox.vue'
import FormTextInput from '../FormTextInput.vue'
import FormButton from '../FormButton.vue'
import { useMainStore } from '~/stores/main'
import { useAuthStore } from '~/stores/auth'
import type { IUser } from '~/utils/types'

const { t } = useI18n()
const mainStore = useMainStore()
const authStore = useAuthStore()
const name = ref(authStore.profile?.name || '')
const nameIsValid = (value: string) => testString(NAME_REGEX, value) || t('nameValidation')
const rights = useRights(ROUTES.api.auth.profile)

function submitHandler() {
  if (nameIsValid(name.value) && authStore.profile) {
    const updatedValues = getUpdatedValues<IUser>(
      authStore.profile,
      { name: name.value },
    )
    if (Object.keys(updatedValues).length > 0)
      authStore.updateProfile(updatedValues)
    else
      mainStore.addAlert({ type: 'warning', text: t('nothingToUpdate') })
  }
}

watch(
  () => authStore.updateProfilePending,
  () => {
    if (authStore.updateProfilePending === true)
      return
    if (authStore.updateProfileError || authStore.updateProfileData !== true)
      mainStore.addAlert({ type: 'error', text: makeErrorText(authStore.updateProfileError) })
    if (authStore.updateProfileData)
      mainStore.addAlert({ type: 'success', text: t('success') })
  },
)
</script>

<template>
  <FormBox @submit="submitHandler">
    <FormTextInput
      v-model:model-value="name" required name="name" :label="$t('email')"
      :rules="[nameIsValid]"
    />
    <FormButton type="submit" color="success" prepand-icon="mdi-content-save" :loading="authStore.updateProfilePending" :disabled="!rights.updating">
      {{ $t('update') }}
    </FormButton>
  </FormBox>
</template>
