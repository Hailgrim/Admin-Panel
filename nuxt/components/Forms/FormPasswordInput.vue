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

const visible = ref(false)
</script>

<template>
  <v-text-field
    v-bind="definedProps" persistent-hint density="compact" variant="outlined"
    :class="hint ? 'pb-3' : ''" :value="modelValue" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
    @input="$emit('update:modelValue', $event.target.value)" @click:append-inner="visible = !visible"
  />
</template>
