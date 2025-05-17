<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

const { t, locale } = useI18n()
const newData = ref<TCreateRole>({
  name: '',
  description: '',
  enabled: false,
})
const nameIsValid = (value: string) => value.length > 0
const { data, error, execute, status } = rolesApi.create()
const mainStore = useMainStore()
const router = useRouter()
const rights = useRights(ROUTES.api.roles)

async function submitHandler(event: SubmitEventPromise) {
  const results = await event

  if (results.valid) execute(newData.value)
}

watch(error, () => {
  if (error.value)
    mainStore.addAlert({
      type: 'error',
      text: getErrorText(error.value, locale.value),
    })
})

watch(data, () => {
  if (data.value) {
    mainStore.addAlert({ type: 'success', text: t('success') })
    router.push(ROUTES.ui.role(data.value.id))
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
      color="info"
      :disabled="!rights.creating"
      :loading="status === 'pending' || Boolean(data)"
      prepand-icon="mdi-plus"
      type="submit"
    >
      {{ $t('create') }}
    </FormButton>
  </FormBase>
</template>
