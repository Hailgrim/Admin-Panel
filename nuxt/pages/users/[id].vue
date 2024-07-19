<script setup lang="ts">
import UpdateUserForm from '~/components/entities/Forms/User/UpdateUserForm.vue'
import UpdateUserRolesForm from '~/components/entities/Forms/User/UpdateUserRolesForm.vue'
import { useRolesStore } from '~/stores/roles/roles'
import { useUsersStore } from '~/stores/users/users'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'user',
  title: 'user',
  description: 'user',
})

const route = useRoute()
const id = String(route.params.id)
const usersStore = useUsersStore()
await usersStore.readRefresh(id)
if (usersStore.readData === null) {
  showError({
    statusCode: 404,
  })
}
const rolesStore = useRolesStore()
await rolesStore.listRefresh(undefined)
</script>

<template>
  <UpdateUserForm v-if="usersStore.readData" :user="usersStore.readData" />
  <v-card-title v-if="usersStore.readData && rolesStore.listData" class="px-0 pt-0 pb-3">
    {{ $t('roles') }}
  </v-card-title>
  <UpdateUserRolesForm
v-if="usersStore.readData && rolesStore.listData" :user="usersStore.readData"
    :roles="rolesStore.listData" />
</template>
