<script setup lang="ts">
defineProps<{
  href: string
  text: string
}>()
</script>

<template>
  <NuxtLink class="link d-block mt-5 text-center text-decoration-none" :href="href">
    {{ text }}
  </NuxtLink>
</template>

<style scoped>
.link + .link {
  margin-top: 8px !important;
}
</style>
