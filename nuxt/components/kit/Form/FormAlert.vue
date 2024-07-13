<script setup lang="ts">
const props = defineProps<{
  title?: string
  text?: string
  type?: 'error' | 'success' | 'warning' | 'info'
}>()
</script>

<template>
  <v-alert v-bind="props" density="compact" variant="tonal" class="mb-6" />
</template>
