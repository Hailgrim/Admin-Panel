<script setup lang="ts">
import CreateUserForm from '~/components/entities/Forms/User/CreateUserForm.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'newUser',
  title: 'newUser',
  description: 'newUser',
})
</script>

<template>
  <CreateUserForm />
</template>
