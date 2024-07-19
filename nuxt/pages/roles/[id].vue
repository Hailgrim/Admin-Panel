<script setup lang="ts">
import UpdateRoleForm from '~/components/entities/Forms/Role/UpdateRoleForm.vue'
import UpdateRoleResourcesForm from '~/components/entities/Forms/Role/UpdateRoleResourcesForm.vue'
import { useResourcesStore } from '~/stores/resources/resources'
import { useRolesStore } from '~/stores/roles/roles'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'role',
  title: 'role',
  description: 'role',
})

const route = useRoute()
const id = Number(route.params.id)
const rolesStore = useRolesStore()
await rolesStore.readRefresh(id)
if (rolesStore.readData === null) {
  showError({
    statusCode: 404,
  })
}
const resourcesStore = useResourcesStore()
await resourcesStore.listRefresh(undefined)
</script>

<template>
  <UpdateRoleForm v-if="rolesStore.readData" :role="rolesStore.readData" />
  <v-card-title v-if="rolesStore.readData && resourcesStore.listData" class="px-0 pt-0 pb-6">
    {{ $t('resources') }}
  </v-card-title>
  <UpdateRoleResourcesForm
v-if="rolesStore.readData && resourcesStore.listData" :role="rolesStore.readData"
    :resources="resourcesStore.listData" />
</template>
