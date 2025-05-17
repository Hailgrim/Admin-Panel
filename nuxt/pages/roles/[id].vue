<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'role',
  title: 'role',
  description: 'role',
})

const route = useRoute()
const id = String(route.params.id)
const { data: roleData, execute: roleExecute } = rolesApi.getOne(ROUTES.api.role(id))
await roleExecute(id)

if (roleData.value === null) {
  showError({
    statusCode: 404,
  })
}

const { data: resourcesData, execute: resourcesExecute } = resourcesApi.getList()
await resourcesExecute(undefined)
</script>

<template>
  <UpdateRoleForm
    v-if="roleData"
    :role="roleData"
  />
  <v-card-title
    v-if="roleData && resourcesData"
    class="px-0 py-3"
  >
    {{ $t('resources') }}
  </v-card-title>
  <UpdateRoleRightsForm
    v-if="roleData && resourcesData"
    :resources="resourcesData.rows"
    :role="roleData"
  />
</template>
