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
defineEmits(['update:modelValue'])
</script>

<template>
  <v-checkbox
    v-bind="props"
    persistent-hint
    density="compact"
    class="checkbox"
    @change="$emit('update:modelValue', $event.target.checked)"
  />
</template>

<style scoped lang="scss">
.checkbox {

  & + & {
    margin-top: -16px !important;
  }

}
</style>
