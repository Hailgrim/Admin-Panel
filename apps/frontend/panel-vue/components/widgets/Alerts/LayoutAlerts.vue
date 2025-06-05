<script setup lang="ts">
const mainStore = useMainStore()
</script>

<template>
  <div class="alerts">
    <v-snackbar
      v-for="alert of mainStore.alerts"
      :key="`alert:${alert.id}`"
      class="alerts__item"
      :color="alert.type"
      contained
      content-class="alerts__content"
      location="bottom right"
      :model-value="!alert.deleted"
      multi-line
      :timeout="5000"
      @update:model-value="mainStore.deleteAlert(alert.id, 1000)"
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
