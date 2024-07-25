<script setup lang="ts">
defineEmits(['submit'])
</script>

<template>
  <v-form class="w-100" validate-on="submit lazy" @submit.prevent="$emit('submit', $event)">
    <slot />
  </v-form>
</template>
