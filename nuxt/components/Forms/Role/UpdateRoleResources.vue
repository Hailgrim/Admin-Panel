<script setup lang="ts">
import ResourceRights from '~/components/Forms/Resource/ResourceRights.vue'
import Form from '~/components/Form/Form.vue'
import FormButton from '~/components/Form/FormButton.vue'
import { useRolesStore } from '~/stores/roles'
import { useMainStore } from '~/stores/main'
import type { IResource, IRole, IRolesResources } from '~/utils/types'

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
const rolesStore = useRolesStore()
const mainStore = useMainStore()
const rights = useRights(ROUTES.api.roles)

function submitHandler() {
  rolesStore.updateResources({
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
  () => rolesStore.updateResourcesPending,
  () => {
    if (rolesStore.updateResourcesPending === true)
      return
    if (rolesStore.updateResourcesError)
      mainStore.addAlert({ type: 'error', text: makeErrorText(rolesStore.updateResourcesError, locale.value) })
    if (rolesStore.updateResourcesData)
      mainStore.addAlert({ type: 'success', text: t('success') })
  },
)
</script>

<template>
  <Form @submit="submitHandler">
    <div class="d-flex flex-row">
      <ResourceRights
        v-for="resource of resources"
        :key="`resourceRights.${resource.id}`"
        :role-id="role.id"
        :resource="resource"
        :rights="updatedRights.filter(value => value.resourceId === resource.id)[0]"
        @update="setRights"
      />
    </div>
    <FormButton
      type="submit" color="success" prepand-icon="mdi-content-save"
      :loading="rolesStore.updateResourcesPending" :disabled="!rights.updating"
    >
      {{ $t('update') }}
    </FormButton>
  </Form>
</template>
