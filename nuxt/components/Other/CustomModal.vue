<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <v-dialog max-width="500" scrim="black">
    <v-card>
      <v-card-title v-if="title" class="text-center py-5">
        {{ title }}
      </v-card-title>
      <v-card-text class="pt-0 pb-5">
        <slot />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
