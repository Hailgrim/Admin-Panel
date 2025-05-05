<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import Form from '~/components/shared/ui/Form/Form.vue'
import FormField from '~/components/shared/ui/Form/FormField.vue'
import FormCheckbox from '~/components/shared/ui/Form/FormCheckbox.vue'
import FormButton from '~/components/shared/ui/Form/FormButton.vue'
import { useMainStore } from '~/store/main/main'
import resourcesApi from '~/api/resources/resourcesApi'
import type { IResource } from '~/api/resources/types'

const { resource } = defineProps<{ resource: IResource }>()

const { t, locale } = useI18n()
const {
  data: uData,
  error: uError,
  execute: uExecute,
  pending: uPending,
} = resourcesApi.update()
const {
  data: dData,
  error: dError,
  execute: dExecute,
  pending: dPending,
} = resourcesApi.delete()
const oldData = ref<IResource>(resource)
const newData = ref<IResource>(resource)
const nameIsValid = (value: string) => value.length > 0
const pathIsValid = (value: string) => value.length > 0
const mainStore = useMainStore()
const router = useRouter()
const rights = useRights(ROUTES.api.resources)

async function submitHandler(event: SubmitEventPromise) {
  const results = await event
  const updatedValues = getUpdatedValues<IResource>(
    oldData.value,
    newData.value,
  )

  if (results.valid && Object.keys(updatedValues).length > 0) {
    uExecute({
      id: resource.id,
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
      router.push(ROUTES.ui.resources)
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
:label="$t('path')" :model-value="newData.path" name="path" required :rules="[pathIsValid]"
      @update:model-value="newData = { ...newData, path: $event }" />
    <FormField
:label="$t('description')" :model-value="newData.description" name="description"
      @update:model-value="newData = { ...newData, description: $event }" />
    <FormCheckbox
:label="$t('enabled')" :model-value="newData.enabled" name="enabled"
      @update:model-value="newData = { ...newData, enabled: $event }" />
    <FormButton
color="success" :disabled="!rights.updating || resource.default || dPending || Boolean(dData)"
      :loading="uPending" prepand-icon="mdi-content-save" type="submit">
      {{ $t('update') }}
    </FormButton>
    <FormButton
color="error" :disabled="!rights.deleting || resource.default" :loading="dPending || Boolean(dData)"
      prepand-icon="mdi-delete" type="button" @click="dExecute({items: [resource.id]})">
      {{ $t('delete') }}
    </FormButton>
  </Form>
</template>
