<script setup lang="ts">
const props = defineProps<{
  name: string
  label?: string
  required?: boolean
  disabled?: boolean
  color?: string
  rules?: ((value: string) => boolean | string)[]
  hint?: string
  type?: string
  modelValue?: string | null
}>()
defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <v-text-field
v-bind="props" :class="props.hint && 'mb-6'" density="compact" persistent-hint variant="outlined"
    @input="$emit('update:modelValue', $event.target.value)" />
</template>

<style scoped lang="scss">
:global(label:has(~ input:required)::after) {
  content: "*";
}
</style>
