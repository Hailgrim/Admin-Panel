<script setup lang="ts">
import { useDisplay } from 'vuetify'

import SideBarMenu from './SideBarMenu.vue'
import { useMainStore } from '~/stores/main'
import type { ISideBarMenuItem } from '~/libs/types'

const mainStore = useMainStore()
const { width } = useDisplay()
const { t } = useI18n()
const menu: ISideBarMenuItem[] = [
  {
    title: t('home'),
    icon: 'mdi-home-city',
    href: '/',
  },
  {
    title: t('profile'),
    icon: 'mdi-account-box',
    href: '/profile',
  },
  {
    title: t('main'),
    icon: 'mdi-widgets',
    childs: [
      {
        title: t('users'),
        icon: 'mdi-account-group-outline',
        href: '/users',
      },
      {
        title: t('roles'),
        icon: 'mdi-account-supervisor',
        href: '/roles',
      },
      {
        title: t('resources'),
        icon: 'mdi-api',
        href: '/resources',
      },
    ],
  },
]
</script>

<template>
  <v-navigation-drawer
    :model-value="width < 1000 ? !mainStore.isSideBarOpened : true" :temporary="width < 1000"
    :rail="width > 1000 ? !mainStore.isSideBarOpened : null"
    :permanent="width > 1000" @update:model-value="mainStore.toggleSideBar(!mainStore.isSideBarOpened)"
  >
    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-shield-account-variant" :title="$t('adminPanel')" :active="false"
        @click="mainStore.toggleSideBar(!mainStore.isSideBarOpened)"
      />
    </v-list>
    <v-divider />
    <SideBarMenu :data="menu" />
  </v-navigation-drawer>
</template>
