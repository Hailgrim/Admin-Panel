<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'user',
  title: 'user',
  description: 'user',
})

const route = useRoute()
const id = String(route.params.id)
const { data: ugoData, execute: ugoExecute } = usersApi.getOne(id)
await ugoExecute()

if (ugoData.value === null) {
  showError({
    statusCode: 404,
  })
}

const { data: rglData, execute: rglExecute } = rolesApi.getList()
await rglExecute()
</script>

<template>
  <UpdateUserForm
    v-if="ugoData"
    :user="ugoData"
  />
  <v-card-title
    v-if="ugoData && rglData"
    class="px-0 py-3"
  >
    {{ $t('roles') }}
  </v-card-title>
  <UpdateUserRolesForm
    v-if="ugoData && rglData"
    :roles="rglData.rows"
    :user="ugoData"
  />
</template>
