<script setup lang="ts">
const props = defineProps<{
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
v-bind="props" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :class="hint ? 'mb-6' : ''"
    density="compact" persistent-hint :type="visible ? 'text' : 'password'" variant="outlined"
    @click:append-inner="visible = !visible" @input="$emit('update:modelValue', $event.target.value)" />
</template>

<style scoped lang="scss">
:global(label:has(~ input:required)::after) {
  content: "*";
}
</style>
