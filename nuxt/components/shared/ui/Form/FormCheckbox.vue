<script setup lang="ts">
const props = defineProps<{
  name: string
  label?: string
  required?: boolean
  color?: string
  rules?: ((value: string) => boolean | string)[]
  hint?: string
  modelValue?: boolean
}>()
defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <v-checkbox
v-bind="props" class="checkbox" density="compact" persistent-hint
    @change="$emit('update:modelValue', $event.target.checked)" />
</template>

<style scoped lang="scss">
.checkbox {
  &+& {
    margin-top: -16px !important;
  }
}

:global(label:has(~ input:required)::after) {
  content: "*";
}
</style>
