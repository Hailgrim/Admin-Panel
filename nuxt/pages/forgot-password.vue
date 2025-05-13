<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'auth',
  name: 'forgotPassword',
  title: 'forgotPassword',
  description: 'forgotPassword',
})
</script>

<template>
  <ForgotPasswordForm />
</template>
