import { defineStore } from 'pinia'

import type { IAlert } from './types'
import type { IUser } from '~/api/users/types'

export const useMainStore = defineStore('main', () => {
  const isSideBarOpened = ref(true)
  function toggleSideBar(value: boolean) {
    isSideBarOpened.value = value
  }

  const profile = ref<IUser | null>(null)
  function setProfile(payload: IUser | null) {
    profile.value = payload
  }

  const alerts = ref<IAlert[]>([])
  const alertCounter = ref(0)
  function addAlert(value: Omit<IAlert, 'id'>) {
    alerts.value = alerts.value.concat({ ...value, id: alertCounter.value++ })
  }
  function deleteAlert(value: number, delay?: number) {
    if (delay) {
      alerts.value = alerts.value.map((alert) => {
        if (alert.id === value) alert.deleted = true
        return alert
      })

      setTimeout(
        () =>
          (alerts.value = alerts.value.filter((alert) => alert.id !== value)),
        delay
      )
    } else {
      alerts.value = alerts.value.filter((alert) => alert.id !== value)
    }
  }

  return {
    isSideBarOpened,
    toggleSideBar,
    alerts,
    addAlert,
    deleteAlert,
    profile,
    setProfile,
  }
})
