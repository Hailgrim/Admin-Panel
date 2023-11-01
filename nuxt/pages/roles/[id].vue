<script setup lang="ts">
import UpdateRole from '~/components/Forms/Role/UpdateRole.vue'
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
</script>

<template>
  <UpdateRole v-if="rolesStore.readData" :role="rolesStore.readData" />
</template>
