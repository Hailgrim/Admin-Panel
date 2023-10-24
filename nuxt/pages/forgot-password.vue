<script setup lang="ts">
import ForgotPassword from '~/components/Forms/Auth/ForgotPassword.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'authorization',
  name: 'forgotPassword',
  title: 'forgotPassword',
  description: 'forgotPassword',
})
</script>

<template>
  <ForgotPassword />
</template>
