<script setup lang="ts">
import resourcesApi from '~/api/resources/resourcesApi'
import rolesApi from '~/api/roles/rolesApi'
import UpdateRoleForm from '~/components/entities/Forms/Role/UpdateRoleForm.vue'
import UpdateRoleResourcesForm from '~/components/entities/Forms/Role/UpdateRoleResourcesForm.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'role',
  title: 'role',
  description: 'role',
})

const route = useRoute()
const id = Number(route.params.id)
const { data: roleData, execute: roleExecute } = rolesApi.read()
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
  <v-card-title v-if="roleData && resourcesData" class="px-0 pt-0 pb-6">
    {{ $t('resources') }}
  </v-card-title>
  <UpdateRoleResourcesForm v-if="roleData && resourcesData" :resources="resourcesData" :role="roleData" />
</template>
