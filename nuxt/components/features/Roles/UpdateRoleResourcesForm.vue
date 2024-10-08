<script setup lang="ts">
import type { IResource, IRolesResources } from '~/api/resources/types'
import rolesApi from '~/api/roles/rolesApi'
import type { IRole } from '~/api/roles/types'
import ResourceRightsFields from '~/components/features/Resources/ResourceRightsFields.vue'
import Form from '~/components/shared/ui/Form/Form.vue'
import FormButton from '~/components/shared/ui/Form/FormButton.vue'
import { useMainStore } from '~/store/main/main'

const { role, resources } = defineProps<{ role: IRole, resources: IResource[] }>()

const updatedRights = ref<IRolesResources[]>(resources.map((resource) => {
  if (role.resources) {
    for (const roleResource of role.resources) {
      if (roleResource.id === resource.id && roleResource.RolesResources)
        return roleResource.RolesResources
    }
  }

  return {
    roleId: role.id,
    resourceId: resource.id,
    creating: false,
    reading: false,
    updating: false,
    deleting: false,
  }
}))

const { t, locale } = useI18n()
const { data, error, execute, pending } = rolesApi.updateResources()
const mainStore = useMainStore()
const rights = useRights(ROUTES.api.roles)

function submitHandler() {
  execute({
    id: role.id,
    fields: updatedRights.value,
  })
}

function setRights(rights: IRolesResources) {
  updatedRights.value = updatedRights.value.map((value) => {
    if (value.resourceId === rights.resourceId)
      return rights

    return value
  })
}

watch(
  error,
  () => {
    if (error.value)
      mainStore.addAlert({ type: 'error', text: makeErrorText(error.value, locale.value) })
  },
)

watch(
  data,
  () => {
    if (data.value)
      mainStore.addAlert({ type: 'success', text: t('success') })
  },
)
</script>

<template>
  <Form @submit="submitHandler">
    <div class="d-flex flex-row">
      <ResourceRightsFields
v-for="resource of resources" :key="`resourceRights.${resource.id}`" :resource="resource"
        :rights="updatedRights.filter(value => value.resourceId === resource.id)[0]" :role-id="role.id"
        @update="setRights" />
    </div>
    <FormButton
color="success" :disabled="!rights.updating" :loading="pending" prepand-icon="mdi-content-save"
      type="submit">
      {{ $t('update') }}
    </FormButton>
  </Form>
</template>
