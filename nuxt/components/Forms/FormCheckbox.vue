<script setup lang="ts">
const definedProps = defineProps<{
  name: string
  label?: string
  required?: boolean
  color?: string
  rules?: ((value: string) => boolean | string)[]
  hint?: string
  modelValue?: boolean
}>()
defineEmits(['update:modelValue'])
</script>

<template>
  <v-checkbox v-bind="definedProps" persistent-hint density="compact" @change="$emit('update:modelValue', $event.target.checked)" />
</template>
