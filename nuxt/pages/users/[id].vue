<script setup lang="ts">
import UpdateUser from '~/components/Forms/User/UpdateUser.vue'
import { useUsersStore } from '~/stores/users'

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
</script>

<template>
  <UpdateUser v-if="usersStore.readData" :user="usersStore.readData" />
</template>
