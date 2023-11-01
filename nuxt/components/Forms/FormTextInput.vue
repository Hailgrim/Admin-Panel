<script setup lang="ts">
const props = defineProps<{
  name: string
  label?: string
  required?: boolean
  color?: string
  rules?: ((value: string) => boolean | string)[]
  hint?: string
  modelValue?: string | null
  type?: string
}>()
defineEmits(['update:modelValue'])
</script>

<template>
  <v-text-field
    v-bind="props" persistent-hint density="compact" variant="outlined" :class="hint ? 'mb-6' : ''"
    :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
