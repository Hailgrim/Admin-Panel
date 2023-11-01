<script setup lang="ts">
defineEmits(['submit'])
</script>

<template>
  <v-form class="form w-100" @submit.prevent="$emit('submit')">
    <slot />
  </v-form>
</template>

<style scoped>
.form > :last-child {
  margin-bottom: unset !important;
}
</style>
