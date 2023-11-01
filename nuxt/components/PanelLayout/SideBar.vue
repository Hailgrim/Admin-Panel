<script setup lang="ts">
import { useDisplay } from 'vuetify'

import SideBarMenu from './SideBarMenu.vue'
import { useMainStore } from '~/stores/main'
import type { ISideBarMenuItem } from '~/utils/types'

const mainStore = useMainStore()
const { width } = useDisplay()
const { t } = useI18n()
const profileRights = useRights(ROUTES.api.auth.getProfile)
const usersRights = useRights(ROUTES.api.users)
const rolesRights = useRights(ROUTES.api.roles)
const resourcesRights = useRights(ROUTES.api.resources)
const menu: ISideBarMenuItem[] = [{
  title: t('home'),
  icon: 'mdi-home-city',
  href: ROUTES.panel.home,
}]

if (profileRights.value.reading || profileRights.value.updating) {
  menu.push({
    title: t('profile'),
    icon: 'mdi-account-box',
    href: ROUTES.panel.profile,
  })
}

const mainMenu: ISideBarMenuItem = {
  title: t('main'),
  icon: 'mdi-widgets',
  childs: [],
}

if (usersRights.value.reading) {
  mainMenu.childs!.push({
    title: t('users'),
    icon: 'mdi-account-group-outline',
    href: ROUTES.panel.users,
  })
}

if (rolesRights.value.reading) {
  mainMenu.childs!.push({
    title: t('roles'),
    icon: 'mdi-account-supervisor',
    href: ROUTES.panel.roles,
  })
}

if (resourcesRights.value.reading) {
  mainMenu.childs!.push({
    title: t('resources'),
    icon: 'mdi-api',
    href: ROUTES.panel.resources,
  })
}

if (mainMenu.childs!.length > 0)
  menu.push(mainMenu)
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
