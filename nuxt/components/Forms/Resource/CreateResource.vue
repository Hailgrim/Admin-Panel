<script setup lang="ts">
import FormBox from '../FormBox.vue'
import FormTextInput from '../FormTextInput.vue'
import FormCheckbox from '../FormCheckbox.vue'
import FormButton from '../FormButton.vue'
import { useResourcesStore } from '~/stores/resources'
import { useMainStore } from '~/stores/main'

const { t } = useI18n()
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
      mainStore.addAlert({ type: 'error', text: makeErrorText(resourcesStore.createError) })
    if (resourcesStore.createData) {
      mainStore.addAlert({ type: 'success', text: t('success') })
      router.push(ROUTES.panel.resource(resourcesStore.createData.id))
    }
  },
)
</script>

<template>
  <FormBox @submit="submitHandler">
    <FormTextInput v-model:model-value="name" required name="name" :label="$t('name')" :rules="[nameIsValid]" />
    <FormTextInput v-model:model-value="path" required name="path" :label="$t('path')" :rules="[pathIsValid]" />
    <FormTextInput v-model:model-value="description" name="description" :label="$t('description')" />
    <FormCheckbox v-model:model-value="enabled" name="enabled" :label="$t('enabled')" />
    <FormButton type="submit" color="info" prepand-icon="mdi-plus" :loading="resourcesStore.createPending" :disabled="!rights.creating">
      {{ $t('create') }}
    </FormButton>
  </FormBox>
</template>
