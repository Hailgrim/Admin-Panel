<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

const { resource } = defineProps<{ resource: IResource }>()

const { t, locale } = useI18n()
const rights = useRights(ROUTES.api.resources)
const mainStore = useMainStore()
const router = useRouter()
const oldData = ref<IResource>(resource)
const newData = ref<IResource>(resource)
const updatedValues = ref<TUpdateResource>({})
const nameIsValid = (value: string) => value.length > 0
const pathIsValid = (value: string) => value.length > 0
const {
  error: uError,
  execute: uExecute,
  status: uStatus,
} = resourcesApi.update({
  id: resource.id,
  fields: updatedValues,
})
const {
  error: dError,
  execute: dExecute,
  status: dStatus,
} = resourcesApi.delete({ items: [resource.id] })

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (!results.valid) {
    return
  }

  updatedValues.value = getUpdatedValues<IResource>(
    oldData.value,
    newData.value,
  )

  if (Object.keys(updatedValues.value).length > 0) {
    uExecute()
  }
  else {
    mainStore.addAlert({ type: 'warning', text: t('nothingToUpdate') })
  }
}

watch(uError, () => {
  if (!uError.value) {
    return
  }

  mainStore.addAlert({
    type: 'error',
    text: getErrorText(uError.value, locale.value),
  })
})

watch(uStatus, () => {
  if (uStatus.value === 'success') {
    oldData.value = newData.value
    mainStore.addAlert({ type: 'success', text: t('success') })
  }
})

watch(dError, () => {
  if (!dError.value) {
    return
  }

  mainStore.addAlert({
    type: 'error',
    text: getErrorText(dError.value, locale.value),
  })
})

watch(dStatus, () => {
  if (dStatus.value === 'success') {
    mainStore.addAlert({ type: 'success', text: t('success') })
    router.push(ROUTES.ui.resources)
  }
})
</script>

<template>
  <FormBase @submit="submitHandler">
    <FormField
      :label="$t('name')"
      :model-value="newData.name"
      name="name"
      required
      :rules="[nameIsValid]"
      @update:model-value="newData = { ...newData, name: $event || '' }"
    />
    <FormField
      :label="$t('path')"
      :model-value="newData.path"
      name="path"
      required
      :rules="[pathIsValid]"
      @update:model-value="newData = { ...newData, path: $event || '' }"
    />
    <FormField
      :label="$t('description')"
      :model-value="newData.description || undefined"
      name="description"
      @update:model-value="newData = { ...newData, description: $event }"
    />
    <FormCheckbox
      :label="$t('enabled')"
      :model-value="newData.enabled"
      name="enabled"
      @update:model-value="newData = { ...newData, enabled: Boolean($event) }"
    />
    <FormButton
      color="success"
      :disabled="!rights.updating || resource.default || dStatus === 'pending' || dStatus === 'success'
      "
      :loading="uStatus === 'pending'"
      prepand-icon="mdi-content-save"
      type="submit"
    >
      {{ $t('update') }}
    </FormButton>
    <FormButton
      color="error"
      :disabled="!rights.deleting || resource.default"
      :loading="dStatus === 'pending' || dStatus === 'success'"
      prepand-icon="mdi-delete"
      type="button"
      @click="dExecute()"
    >
      {{ $t('delete') }}
    </FormButton>
  </FormBase>
</template>
