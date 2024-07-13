<script setup lang="ts">
import UpdateProfile from '~/components/entities/Forms/Auth/UpdateProfile.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
  name: 'profile',
  title: 'profile',
  description: 'profile',
})
</script>

<template>
  <UpdateProfile />
</template>
