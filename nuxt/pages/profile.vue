<script setup lang="ts">
import UpdateProfileForm from '~/components/entities/Forms/Auth/UpdateProfileForm.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'profile',
  title: 'profile',
  description: 'profile',
})
</script>

<template>
  <UpdateProfileForm />
</template>
