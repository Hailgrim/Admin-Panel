<script setup lang="ts">
defineEmits(['submit'])
</script>

<template>
  <v-form class="w-100" @submit.prevent="$emit('submit')">
    <slot />
  </v-form>
</template>
