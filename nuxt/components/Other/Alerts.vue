<script setup lang="ts">
import { useMainStore } from '~/stores/main'

const mainStore = useMainStore()
</script>

<template>
  <div class="alerts">
    <v-snackbar
      v-for="alert of mainStore.alerts"
      :key="`alert:${alert.id}`"
      :model-value="alert.deleted !== true"
      :color="alert.type"
      location="bottom right"
      class="alerts__item"
      content-class="alerts__content"
      multi-line
      contained
    >
      <template #actions>
        <v-btn
          variant="text"
          @click="mainStore.deleteAlert(alert.id, 1000)"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
      {{ alert.text }}
    </v-snackbar>
  </div>
</template>

<style scoped lang="scss">
.alerts {
  position: fixed;
  bottom: 0;
  right: 0;
  max-width: 100%;
  &__item {
    position: relative;
    max-width: 100%;
    :global(.alerts__content) {
      position: relative;
      min-width: unset;
      width: 300px;
    }
  }
}
</style>
