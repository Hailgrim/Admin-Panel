<script setup lang="ts">
const mainStore = useMainStore()
</script>

<template>
  <p class="text-body-1 pb-3">
    {{ mainStore.profile?.roles?.map((role) => role.name).join(', ') || $t('empty') }}
  </p>
</template>
