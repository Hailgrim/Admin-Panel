<script setup lang="ts">
import SideBarMenuItem from './SideBarMenuItem.vue'
import type { IMenuItem } from './types'
import { checkActiveLink } from './utils';

const route = useRoute()
const { t } = useI18n()
const profileRights = useRights(ROUTES.api.auth.profile)
const usersRights = useRights(ROUTES.api.users)
const rolesRights = useRights(ROUTES.api.roles)
const resourcesRights = useRights(ROUTES.api.resources)

const menu: IMenuItem[] = [{
  title: t('home'),
  icon: 'mdi-home',
  href: ROUTES.panel.home,
}]

if (profileRights.value.reading) {
  menu.push({
    title: t('profile'),
    icon: 'mdi-account-box',
    href: ROUTES.panel.profile,
  })
}

const mainMenu: IMenuItem = {
  title: t('main'),
  icon: 'mdi-widgets',
  childs: [],
}

if (usersRights.value.reading) {
  mainMenu.childs!.push({
    title: t('users'),
    icon: 'mdi-account-group',
    href: ROUTES.panel.users,
  })
}

if (rolesRights.value.reading) {
  mainMenu.childs!.push({
    title: t('roles'),
    icon: 'mdi-account-supervisor-circle',
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

const opened = menu.find(value => checkActiveLink(route.path, { href: value.href, childs: value.childs }))
</script>

<template>
  <v-list
density="compact" nav :aria-label="$t('mainMenu')"
    :opened="[opened ? `${opened.title}: ${opened.href}` : '']">
    <SideBarMenuItem v-for="item of menu" :key="`sbmi:${item.title}:${item.href}`" v-bind="item" />
  </v-list>
</template>
