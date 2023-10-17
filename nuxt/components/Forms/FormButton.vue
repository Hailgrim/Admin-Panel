<script setup lang="ts">
const props = defineProps<{
  type?: string
  color?: string
  loading?: boolean
  disabled?: boolean
  block?: boolean
}>()
defineEmits(['click'])
</script>

<template>
  <v-btn v-bind="props" class="custom mb-5" size="large" variant="flat" @click="$emit('click')">
    <slot />
  </v-btn>
</template>

<style scoped>
.custom:disabled {
  opacity: 0.5;
}
.custom:last-child {
  margin-bottom: unset !important;
}
</style>
