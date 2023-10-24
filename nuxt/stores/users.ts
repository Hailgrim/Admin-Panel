import { defineStore } from 'pinia'

import type { IListReq, IUser } from '~/libs/types'

export const useUsersStore = defineStore('users', () => {
  const getUsers = useCustomFetch<IUser[], IListReq<IUser> | void>('users', { method: 'GET', credentials: 'include' })

  return {
    getUsers,
  }
})
