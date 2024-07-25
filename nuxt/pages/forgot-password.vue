<script setup lang="ts">
import ForgotPasswordForm from '~/components/entities/Forms/Auth/ForgotPasswordForm.vue'

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
