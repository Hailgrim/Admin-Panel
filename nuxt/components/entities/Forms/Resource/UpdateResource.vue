<script setup lang="ts">
import Form from '~/components/kit/Form/Form.vue'
import FormField from '~/components/kit/Form/FormField.vue'
import FormCheckbox from '~/components/kit/Form/FormCheckbox.vue'
import FormButton from '~/components/kit/Form/FormButton.vue'
import { useResourcesStore } from '~/stores/resources/resources'
import { useMainStore } from '~/stores/main/main'
import type { IResource } from '~/stores/resources/types'

const { resource } = defineProps<{ resource: IResource }>()

const { t, locale } = useI18n()
const resourcesStore = useResourcesStore()
const name = ref(resource.name)
const nameIsValid = (value: string) => value.length > 0
const path = ref(resource.path)
const pathIsValid = (value: string) => value.length > 0
const description = ref(resource.description)
const enabled = ref(resource.enabled)
const mainStore = useMainStore()
const router = useRouter()
const rights = useRights(ROUTES.api.resources)

function submitHandler() {
  if (nameIsValid(name.value) && pathIsValid(path.value)) {
    resourcesStore.update({
      id: resource.id,
      fields: { name: name.value, path: path.value, description: description.value, enabled: enabled.value },
    })
  }
}

watch(
  () => resourcesStore.updatePending,
  () => {
    if (resourcesStore.updatePending === true)
      return
    if (resourcesStore.updateError)
      mainStore.addAlert({ type: 'error', text: makeErrorText(resourcesStore.updateError, locale.value) })
    if (resourcesStore.updateData)
      mainStore.addAlert({ type: 'success', text: t('success') })
  },
)

watch(
  () => resourcesStore.deletePending,
  () => {
    if (resourcesStore.deletePending === true)
      return
    if (resourcesStore.deleteError)
      mainStore.addAlert({ type: 'error', text: makeErrorText(resourcesStore.deleteError, locale.value) })
    if (resourcesStore.deleteData) {
      mainStore.addAlert({ type: 'success', text: t('success') })
      router.push(ROUTES.panel.resources)
    }
  },
)
</script>

<template>
  <Form @submit="submitHandler">
    <FormField v-model:model-value="name" required name="name" :label="$t('name')" :rules="[nameIsValid]" />
    <FormField v-model:model-value="path" required name="path" :label="$t('path')" :rules="[pathIsValid]" />
    <FormField v-model:model-value="description" name="description" :label="$t('description')" />
    <FormCheckbox v-model:model-value="enabled" name="enabled" :label="$t('enabled')" />
    <FormButton
type="submit" color="success" prepand-icon="mdi-content-save" :loading="resourcesStore.updatePending"
      :disabled="!rights.updating || resourcesStore.readData?.default">
      {{ $t('update') }}
    </FormButton>
    <FormButton
type="button" color="error" prepand-icon="mdi-delete" :loading="resourcesStore.deletePending"
      :disabled="!rights.deleting || resourcesStore.readData?.default" @click="resourcesStore.delete(resource.id)">
      {{ $t('delete') }}
    </FormButton>
  </Form>
</template>
