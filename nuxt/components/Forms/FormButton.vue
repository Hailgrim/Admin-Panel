<script setup lang="ts">
const definedProps = defineProps<{
  type?: string
  color?: string
  loading?: boolean
  disabled?: boolean
  block?: boolean
}>()
defineEmits(['click'])
</script>

<template>
  <v-btn v-bind="definedProps" size="large" variant="flat" @click="$emit('click')">
    <slot />
  </v-btn>
</template>
