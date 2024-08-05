<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

import Form from '~/components/shared/kit/Form/Form.vue'
import FormField from '~/components/shared/kit/Form/FormField.vue'
import FormCheckbox from '~/components/shared/kit/Form/FormCheckbox.vue'
import FormButton from '~/components/shared/kit/Form/FormButton.vue'
import { useMainStore } from '~/store/main/main'
import resourcesApi from '~/api/resources/resourcesApi'
import type { IResourceCreate } from '~/api/resources/types'

const { t, locale } = useI18n()
const newData = ref<IResourceCreate>({
  name: '',
  path: '',
  description: '',
  enabled: false
})
const nameIsValid = (value: string) => value.length > 0
const pathIsValid = (value: string) => value.length > 0
const { data, error, execute, pending } = resourcesApi.create()
const mainStore = useMainStore()
const router = useRouter()
const rights = useRights(ROUTES.api.resources)

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (results.valid)
    execute(newData.value)
}

watch(
  pending,
  () => {
    if (pending.value) return

    if (error.value)
      mainStore.addAlert({ type: 'error', text: makeErrorText(error.value, locale.value) })

    if (data.value) {
      mainStore.addAlert({ type: 'success', text: t('success') })
      router.push(ROUTES.panel.resource(data.value.id))
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
color="info" :disabled="!rights.creating" :loading="pending || Boolean(data)" prepand-icon="mdi-plus"
      type="submit">
      {{ $t('create') }}
    </FormButton>
  </Form>
</template>
