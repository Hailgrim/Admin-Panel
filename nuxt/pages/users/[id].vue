<script setup lang="ts">
import UpdateUser from '~/components/entities/Forms/User/UpdateUser.vue'
import UpdateUserRoles from '~/components/entities/Forms/User/UpdateUserRoles.vue'
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
const id = Number(route.params.id)
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
  <UpdateUser v-if="usersStore.readData" :user="usersStore.readData" />
  <v-card-title v-if="usersStore.readData && rolesStore.listData" class="px-0 pt-0 pb-3">
    {{ $t('roles') }}
  </v-card-title>
  <UpdateUserRoles
v-if="usersStore.readData && rolesStore.listData" :user="usersStore.readData"
    :roles="rolesStore.listData" />
</template>
