<script setup lang="ts">
import resourcesApi from '~/api/resources/resourcesApi'
import rolesApi from '~/api/roles/rolesApi'
import UpdateRoleForm from '~/components/features/Roles/UpdateRoleForm.vue'
import UpdateRoleResourcesForm from '~/components/features/Roles/UpdateRoleResourcesForm.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'role',
  title: 'role',
  description: 'role',
})

const route = useRoute()
const id = String(route.params.id)
const { data: roleData, execute: roleExecute } = rolesApi.read(ROUTES.api.role(id))
await roleExecute(id)

if (roleData.value === null) {
  showError({
    statusCode: 404,
  })
}

const { data: resourcesData, execute: resourcesExecute } = resourcesApi.list()
await resourcesExecute(undefined)
</script>

<template>
  <UpdateRoleForm v-if="roleData" :role="roleData" />
  <v-card-title v-if="roleData && resourcesData" class="px-0 py-3">
    {{ $t('resources') }}
  </v-card-title>
  <UpdateRoleResourcesForm v-if="roleData && resourcesData" :resources="resourcesData" :role="roleData" />
</template>
