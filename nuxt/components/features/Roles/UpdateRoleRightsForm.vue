<script setup lang="ts">
const { role, resources } = defineProps<{
  role: IRole
  resources: IResource[]
}>()

const { t, locale } = useI18n()
const { status, error, execute } = rolesApi.updateRights()
const mainStore = useMainStore()
const updatedRights = ref<IRights[]>(role.rights || [])
const rights = useRights(ROUTES.api.roles)

function submitHandler() {
  execute({
    id: role.id,
    fields: { items: updatedRights.value },
  })
}

function updateRights(newRights: IRights) {
  const filteredRights = updatedRights.value.filter((value) => {
    if (
      newRights.roleId === value.roleId
      && newRights.resourceId === value.resourceId
    ) {
      return false
    }
    else {
      return true
    }
  })

  if (
    newRights.creating
    || newRights.reading
    || newRights.updating
    || newRights.deleting
  ) {
    filteredRights.push(newRights)
  }

  updatedRights.value = filteredRights
}

watch(error, () => {
  if (error.value)
    mainStore.addAlert({
      type: 'error',
      text: getErrorText(error.value, locale.value),
    })
})

watch(status, () => {
  if (status.value === 'success') mainStore.addAlert({ type: 'success', text: t('success') })
})
</script>

<template>
  <FormBase @submit="submitHandler">
    <div class="d-flex flex-row">
      <ResourceRightsFields
        v-for="resource of resources"
        :key="`resourceRights.${resource.id}`"
        :resource="resource"
        :rights="updatedRights.find((value) => value.resourceId === resource.id)"
        :role-id="role.id"
        @update="updateRights"
      />
    </div>
    <FormButton
      color="success"
      :disabled="!rights.updating || role.default"
      :loading="status === 'pending'"
      prepand-icon="mdi-content-save"
      type="submit"
    >
      {{ $t('update') }}
    </FormButton>
  </FormBase>
</template>
