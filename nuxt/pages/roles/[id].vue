<script setup lang="ts">
import UpdateRole from '~/components/Forms/Role/UpdateRole.vue'
import UpdateRoleResources from '~/components/Forms/Role/UpdateRoleResources.vue'
import { useResourcesStore } from '~/stores/resources'
import { useRolesStore } from '~/stores/roles'

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
const resourcesStore = useResourcesStore()
await resourcesStore.listRefresh()
</script>

<template>
  <UpdateRole v-if="rolesStore.readData" :role="rolesStore.readData" />
  <v-card-title v-if="rolesStore.readData && resourcesStore.listData" class="px-0 pt-0 pb-6">
    {{ $t('resources') }}
  </v-card-title>
  <UpdateRoleResources
    v-if="rolesStore.readData && resourcesStore.listData"
    :role="rolesStore.readData"
    :resources="resourcesStore.listData"
  />
</template>
