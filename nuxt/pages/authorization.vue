<script setup lang="ts">
import Authorization from '~/components/Forms/Auth/Authorization.vue'
import { useUsersStore } from '~/stores/users'

definePageMeta({
  middleware: ['auth'],
  layout: 'authorization',
  name: 'signIn',
  title: 'signIn',
  description: 'signIn',
})

const usersStore = useUsersStore()
await usersStore.getUsers()
</script>

<template>
  <div>Error!!! {{ usersStore.getUsersError?.status || 0 }}</div>
  <Authorization />
</template>
