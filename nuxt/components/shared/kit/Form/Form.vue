<script setup lang="ts">
defineEmits(['submit'])
</script>

<template>
  <v-form class="w-100" validate-on="submit" @submit.prevent="$emit('submit')">
    <slot />
  </v-form>
</template>
