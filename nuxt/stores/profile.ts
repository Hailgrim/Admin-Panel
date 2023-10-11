import { defineStore } from 'pinia'

import type { IUser } from '~/libs/types'
import { makeErrorText } from '~/libs/functions'

export const useProfileStore = defineStore('main', () => {
  const profile = ref<IUser | null>(null)
  function setProfile(value: IUser | null) {
    profile.value = value
  }

  const authPending = ref<boolean>(false)
  const authErrorText = ref<string | null>(null)
  const authErrorCode = ref<number | null>(null)
  async function authorization() {
    authPending.value = true
    authErrorCode.value = null
    const { data, error } = await useFetch<IUser>('https://jsonplaceholder.typicode.com/todos/1')
    authPending.value = false
    if (data)
      profile.value = data.value
    if (error) {
      authErrorCode.value = error.value?.status ?? null
      const { t } = useI18n()
      switch (error.value?.status) {
        case 410:
          authErrorText.value = t('userDeleted')
          break
        case 403:
          authErrorText.value = null
          break
        case 401:
          authErrorText.value = t('wrongEmailOrPassword')
          break
        default:
          authErrorText.value = makeErrorText(error.value)
          break
      }
    }
  }

  return {
    profile,
    setProfile,
    authErrorText,
    authErrorCode,
    authorization,
  }
})
