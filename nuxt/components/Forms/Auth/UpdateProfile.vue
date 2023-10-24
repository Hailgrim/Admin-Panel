<script setup lang="ts">
import FormBox from '../FormBox.vue'
import FormTextInput from '../FormTextInput.vue'
import FormButton from '../FormButton.vue'
import { useMainStore } from '~/stores/main'
import { useProfileStore } from '~/stores/profile'
import { getUpdatedValues, makeErrorText, testString } from '~/libs/functions'
import { NAME_REGEX } from '~/libs/constants'
import type { IUser } from '~/libs/types'

const { t } = useI18n()
const mainStore = useMainStore()
const profileStore = useProfileStore()
const name = ref(profileStore.profile?.name || '')
const nameIsValid = (value: string) => testString(NAME_REGEX, value) || t('nameValidation')

function submitHandler() {
  if (nameIsValid(name.value) && profileStore.profile) {
    const updatedValues = getUpdatedValues<IUser>(
      profileStore.profile,
      { name: name.value },
    )
    if (Object.keys(updatedValues).length > 0)
      profileStore.updateProfile(updatedValues)
    else
      mainStore.addAlert({ type: 'warning', text: t('nothingToUpdate') })
  }
}

watch(
  () => profileStore.updateProfilePending,
  () => {
    if (profileStore.updateProfilePending === true)
      return
    if (profileStore.updateProfileError || profileStore.updateProfileData !== true)
      mainStore.addAlert({ type: 'error', text: makeErrorText(profileStore.updateProfileError) })
    if (profileStore.updateProfileData)
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
    <FormButton type="submit" color="success" prepand-icon="mdi-content-save" :loading="profileStore.updateProfilePending">
      {{ $t('update') }}
    </FormButton>
  </FormBox>
</template>
