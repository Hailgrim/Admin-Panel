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
const { data: ufoData, execute: ufoExecute } = usersApi.getOne(ROUTES.api.user(id))
await ufoExecute(id)

if (ufoData.value === null) {
  showError({
    statusCode: 404,
  })
}

const { data: rfaData, execute: rfaExecute } = rolesApi.getList()
await rfaExecute(undefined)
</script>

<template>
  <UpdateUserForm v-if="ufoData" :user="ufoData" />
  <v-card-title v-if="ufoData && rfaData" class="px-0 py-3">
    {{ $t('roles') }}
  </v-card-title>
  <UpdateUserRolesForm v-if="ufoData && rfaData" :roles="rfaData.rows" :user="ufoData" />
</template>
