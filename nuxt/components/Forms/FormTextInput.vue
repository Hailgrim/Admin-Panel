<script setup lang="ts">
const definedProps = defineProps<{
  name: string
  label?: string
  required?: boolean
  color?: string
  rules?: ((value: string) => boolean | string)[]
  hint?: string
  modelValue?: string
}>()
defineEmits(['update:modelValue'])
</script>

<template>
  <v-text-field
    v-bind="definedProps" persistent-hint type="text" density="compact" variant="outlined"
    :class="hint ? 'pb-5' : ''" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
