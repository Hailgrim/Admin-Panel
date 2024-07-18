<script setup lang="ts">
import Form from '~/components/shared/kit/Form/Form.vue'
import FormField from '~/components/shared/kit/Form/FormField.vue'
import FormCheckbox from '~/components/shared/kit/Form/FormCheckbox.vue'
import FormButton from '~/components/shared/kit/Form/FormButton.vue'
import { useResourcesStore } from '~/stores/resources/resources'
import { useMainStore } from '~/stores/main/main'

const { t, locale } = useI18n()
const name = ref('')
const nameIsValid = (value: string) => value.length > 0
const path = ref('')
const pathIsValid = (value: string) => value.length > 0
const description = ref('')
const enabled = ref(true)
const resourcesStore = useResourcesStore()
const mainStore = useMainStore()
const router = useRouter()
const rights = useRights(ROUTES.api.resources)

function submitHandler() {
  if (nameIsValid(name.value) && pathIsValid(path.value))
    resourcesStore.create({ name: name.value, path: path.value, description: description.value || null, enabled: enabled.value })
}

watch(
  () => resourcesStore.createPending,
  () => {
    if (resourcesStore.createPending === true)
      return
    if (resourcesStore.createError)
      mainStore.addAlert({ type: 'error', text: makeErrorText(resourcesStore.createError, locale.value) })
    if (resourcesStore.createData) {
      mainStore.addAlert({ type: 'success', text: t('success') })
      router.push(ROUTES.panel.resource(resourcesStore.createData.id))
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
    <FormButton type="submit" color="info" prepand-icon="mdi-plus" :loading="resourcesStore.createPending"
      :disabled="!rights.creating">
      {{ $t('create') }}
    </FormButton>
  </Form>
</template>
