<script setup lang="ts">
import { useDisplay } from 'vuetify'

const mainStore = useMainStore()
const { width } = useDisplay()
</script>

<template>
  <v-navigation-drawer
    :model-value="width < 1000 ? !mainStore.isSideBarOpened : true"
    :permanent="width > 1000"
    :rail="width > 1000 ? !mainStore.isSideBarOpened : null"
    :temporary="width < 1000"
    @update:model-value="mainStore.toggleSideBar(!mainStore.isSideBarOpened)"
  >
    <v-list
      density="compact"
      nav
    >
      <v-list-item
        :active="false"
        prepend-icon="mdi-shield-account-variant"
        :title="$t('adminPanel')"
        @click="mainStore.toggleSideBar(!mainStore.isSideBarOpened)"
      />
    </v-list>
    <v-divider />
    <SideBarMenu />
  </v-navigation-drawer>
</template>
