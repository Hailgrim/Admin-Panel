<script setup lang="ts">
defineEmits<{
  (event: 'submit'): void
}>()
</script>

<template>
  <v-form class="w-100" @submit.prevent="$emit('submit')">
    <slot />
  </v-form>
</template>
