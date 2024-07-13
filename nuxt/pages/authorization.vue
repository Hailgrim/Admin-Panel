<script setup lang="ts">
import SignInForm from '~/components/entities/Forms/Auth/SignInForm.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'auth',
  name: 'signIn',
  title: 'signIn',
  description: 'signIn',
})
</script>

<template>
  <SignInForm />
</template>
