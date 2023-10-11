<script setup lang="ts">
const definedProps = defineProps<{
  title?: string
  text?: string
}>()
</script>

<template>
  <v-alert v-bind="definedProps" density="compact" variant="tonal" class="mb-6" type="error" />
</template>
