import { defineStore } from 'pinia'

import type { IAlert, ICookies, LangList } from '~/libs/types'

let alertCounter = 0

export const useMainStore = defineStore('main', () => {
  const rememberMe = ref<boolean>(false)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  function setAuthTokens(value: ICookies) {
    accessToken.value = value.accessToken
    refreshToken.value = value.refreshToken
    rememberMe.value = value.rememberMe
  }

  const userAgent = ref<string | null>(null)
  function setUserAgent(value: string | null) {
    userAgent.value = value
  }

  const isSideBarOpened = ref<boolean>(true)
  function toggleSideBar(value: boolean) {
    isSideBarOpened.value = value
  }

  const isModalSideBarOpened = ref<boolean>(false)
  function toggleModalSideBar(value: boolean) {
    isModalSideBarOpened.value = value
  }

  const userLang = ref<LangList>('en')
  function setUserLang(value: LangList) {
    userLang.value = value
  }

  const alerts = ref<IAlert[]>([])
  function addAlert(value: Omit<IAlert, 'id'>) {
    alerts.value.push({ ...value, id: alertCounter++ })
  }
  function deleteAlert(value: number) {
    alerts.value = alerts.value.filter(alert => alert.id !== value)
  }

  return {
    rememberMe,
    accessToken,
    refreshToken,
    setAuthTokens,
    userAgent,
    setUserAgent,
    isSideBarOpened,
    toggleSideBar,
    isModalSideBarOpened,
    toggleModalSideBar,
    userLang,
    setUserLang,
    alerts,
    addAlert,
    deleteAlert,
  }
})
