<script setup lang="ts">
import rolesApi from '~/api/roles/rolesApi'
import usersApi from '~/api/users/usersApi'
import UpdateUserForm from '~/components/features/Users/UpdateUserForm.vue'
import UpdateUserRolesForm from '~/components/features/Users/UpdateUserRolesForm.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'user',
  title: 'user',
  description: 'user',
})

const route = useRoute()
const id = String(route.params.id)
const { data: urData, execute: urExecute } = usersApi.read(ROUTES.api.user(id))
await urExecute(id)

if (urData.value === null) {
  showError({
    statusCode: 404,
  })
}

const { data: rlData, execute: rlExecute } = rolesApi.list()
await rlExecute(undefined)
</script>

<template>
  <UpdateUserForm v-if="urData" :user="urData" />
  <v-card-title v-if="urData && rlData" class="px-0 py-3">
    {{ $t('roles') }}
  </v-card-title>
  <UpdateUserRolesForm v-if="urData && rlData" :roles="rlData" :user="urData" />
</template>
