<script setup lang="ts">
import CreateUser from '~/components/entities/Forms/User/CreateUser.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'newUser',
  title: 'newUser',
  description: 'newUser',
})
</script>

<template>
  <CreateUser />
</template>
