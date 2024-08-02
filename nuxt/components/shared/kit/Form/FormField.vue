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
v-bind="props" :class="props.hint && 'mb-6'" density="compact" persistent-hint variant="outlined"
    @input="$emit('update:modelValue', $event.target.value)" />
</template>

<style scoped lang="scss">
:global(label:has(~ input:required)::after) {
  content: "*";
}
</style>
