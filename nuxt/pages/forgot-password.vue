<script setup lang="ts">
import ForgotForm from '~/components/Forms/Auth/ForgotForm.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'auth',
  name: 'forgotPassword',
  title: 'forgotPassword',
  description: 'forgotPassword',
})
</script>

<template>
  <ForgotForm />
</template>
