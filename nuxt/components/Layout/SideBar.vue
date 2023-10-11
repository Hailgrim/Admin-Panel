<script setup lang="ts">
import { storeToRefs } from 'pinia'

import SideBarMenu from './SideBarMenu.vue'
import { useMainStore } from '~/stores/main'
import type { ISideBarMenuItem } from '~/libs/types'

const mainStore = useMainStore()
const { toggleSideBar } = mainStore
const { isSideBarOpened } = storeToRefs(mainStore)
const { t } = useI18n()
const menu: ISideBarMenuItem[] = [
  {
    title: t('home'),
    icon: 'mdi-home-city',
    href: '/',
  },
  {
    title: t('profile'),
    icon: 'mdi-account',
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
  <v-navigation-drawer permanent :rail="!isSideBarOpened">
    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-menu" :title="$t('adminPanel')" :active="false"
        @click="toggleSideBar(!isSideBarOpened)"
      />
    </v-list>
    <v-divider />
    <SideBarMenu :data="menu" />
  </v-navigation-drawer>
</template>
