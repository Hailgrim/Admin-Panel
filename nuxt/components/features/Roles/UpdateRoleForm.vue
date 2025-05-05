<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import Form from '~/components/shared/ui/Form/Form.vue'
import FormField from '~/components/shared/ui/Form/FormField.vue'
import FormCheckbox from '~/components/shared/ui/Form/FormCheckbox.vue'
import FormButton from '~/components/shared/ui/Form/FormButton.vue'
import { useMainStore } from '~/store/main/main'
import rolesApi from '~/api/roles/rolesApi'
import type { IRole } from '~/api/roles/types'

const { role } = defineProps<{ role: IRole }>()

const { t, locale } = useI18n()
const {
  data: uData,
  error: uError,
  execute: uExecute,
  pending: uPending,
} = rolesApi.update()
const {
  data: dData,
  error: dError,
  execute: dExecute,
  pending: dPending,
} = rolesApi.delete()
const oldData = ref<IRole>(role)
const newData = ref<IRole>(role)
const nameIsValid = (value: string) => value.length > 0
const mainStore = useMainStore()
const router = useRouter()
const rights = useRights(ROUTES.api.roles)

async function submitHandler(event: SubmitEventPromise) {
  const results = await event
  const updatedValues = getUpdatedValues<IRole>(
    oldData.value,
    newData.value,
  )

  if (results.valid && Object.keys(updatedValues).length > 0) {
    uExecute({
      id: role.id,
      fields: updatedValues,
    })
  } else {
    mainStore.addAlert({ type: 'warning', text: t('nothingToUpdate') })
  }
}

watch(
  uError,
  () => {
    if (uError.value)
      mainStore.addAlert({ type: 'error', text: makeErrorText(uError.value, locale.value) })
  },
)

watch(
  uData,
  () => {
    if (uData.value) {
      oldData.value = newData.value
      mainStore.addAlert({ type: 'success', text: t('success') })
    }
  },
)

watch(
  dError,
  () => {
    if (dError.value)
      mainStore.addAlert({ type: 'error', text: makeErrorText(dError.value, locale.value) })
  },
)

watch(
  dData,
  () => {
    if (dData.value) {
      mainStore.addAlert({ type: 'success', text: t('success') })
      router.push(ROUTES.ui.roles)
    }
  },
)
</script>

<template>
  <Form @submit="submitHandler">
    <FormField
:label="$t('name')" :model-value="newData.name" name="name" required :rules="[nameIsValid]"
      @update:model-value="newData = { ...newData, name: $event }" />
    <FormField
:label="$t('description')" :model-value="newData.description" name="description"
      @update:model-value="newData = { ...newData, description: $event }" />
    <FormCheckbox
:label="$t('enabled')" :model-value="newData.enabled" name="enabled"
      @update:model-value="newData = { ...newData, enabled: $event }" />
    <FormButton
color="success" :disabled="!rights.updating || role.default || dPending || Boolean(dData)"
      :loading="uPending" prepand-icon="mdi-content-save" type="submit">
      {{ $t('update') }}
    </FormButton>
    <FormButton
color="error" :disabled="!rights.deleting || role.default" :loading="dPending || Boolean(dData)"
      prepand-icon="mdi-delete" type="button" @click="dExecute({items: [role.id]})">
      {{ $t('delete') }}
    </FormButton>
  </Form>
</template>
